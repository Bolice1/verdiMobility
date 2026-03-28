import { randomUUID } from 'node:crypto';

import { env } from '../config/index.js';
import { pool } from '../database/pool.js';
import * as paymentModel from '../models/payment.model.js';
import * as shipmentModel from '../models/shipment.model.js';
import * as userModel from '../models/user.model.js';
import * as vehicleModel from '../models/vehicle.model.js';
import { AppError } from '../utils/AppError.js';
import { paginationMeta } from '../utils/pagination.js';
import * as emailService from './email.service.js';

const CREATE_ALLOWED_PAYMENT_STATUSES = new Set([
  'pending',
  'matched',
  'in_transit',
  'delivered',
]);

const TRANSITIONS = {
  pending: new Set(['authorized', 'processing', 'completed', 'failed', 'cancelled']),
  authorized: new Set(['processing', 'completed', 'failed', 'cancelled']),
  processing: new Set(['completed', 'failed', 'cancelled']),
  completed: new Set([]),
  failed: new Set([]),
  cancelled: new Set([]),
  partially_refunded: new Set(['refunded']),
  refunded: new Set([]),
};

function canTransition(from, to) {
  return TRANSITIONS[from]?.has(to) ?? false;
}

async function assertShipmentOwner(actor, shipment) {
  if (actor.role === 'admin') return;
  if (actor.role === 'user' && shipment.senderId === actor.id) return;
  throw new AppError('Forbidden', 403, 'FORBIDDEN');
}

async function assertPaymentVisibility(actor, payment) {
  if (actor.role === 'admin') return;

  const shipment = await shipmentModel.findShipmentById(payment.shipmentId);
  if (!shipment) {
    throw new AppError('Shipment not found', 404, 'NOT_FOUND');
  }

  if (actor.role === 'user' && shipment.senderId === actor.id) return;

  if (payment.shipmentId && shipment.vehicleId) {
    const vehicle = await vehicleModel.findVehicleById(shipment.vehicleId);
    if (actor.role === 'company' && vehicle?.companyId === actor.companyId) return;
    if (actor.role === 'driver' && vehicle?.driverId) {
      const scoped = await paymentModel.listPaymentsForActor({
        actor,
        paymentId: payment.id,
        shipmentId: undefined,
        status: undefined,
        limit: 1,
        offset: 0,
      });
      if (scoped.total > 0) return;
    }
  }

  throw new AppError('Forbidden', 403, 'FORBIDDEN');
}

function normalizeCurrency(currency) {
  return (currency || env.paymentDefaultCurrency || 'USD').trim().toUpperCase();
}

function buildExternalReference(shipmentId) {
  return `pay_${shipmentId.slice(0, 8)}_${randomUUID().slice(0, 8)}`;
}

function paymentStatusEmailType(status) {
  if (status === 'completed') return 'completed';
  if (status === 'failed') return 'failed';
  if (status === 'cancelled') return 'cancelled';
  return null;
}

async function sendPaymentStatusEmail(payment, shipment, status, requestId) {
  const sender = await userModel.findUserEmailAndNameById(shipment.senderId);
  if (!sender?.email) return;

  const type = paymentStatusEmailType(status);
  if (type === 'completed') {
    emailService.queuePaymentCompletedEmail({
      to: sender.email,
      name: sender.name,
      payment,
      shipment,
      requestId,
    });
  } else if (type === 'failed') {
    emailService.queuePaymentFailedEmail({
      to: sender.email,
      name: sender.name,
      payment,
      shipment,
      requestId,
    });
  } else if (type === 'cancelled') {
    emailService.queuePaymentCancelledEmail({
      to: sender.email,
      name: sender.name,
      payment,
      shipment,
      requestId,
    });
  }
}

export async function createPayment(actor, input, requestId) {
  const shipment = await shipmentModel.findShipmentById(input.shipmentId);
  if (!shipment) {
    throw new AppError('Shipment not found', 404, 'NOT_FOUND');
  }
  await assertShipmentOwner(actor, shipment);

  if (!CREATE_ALLOWED_PAYMENT_STATUSES.has(shipment.status)) {
    throw new AppError(
      'Cannot create a payment for this shipment status',
      400,
      'INVALID_SHIPMENT_STATUS',
    );
  }

  const amount = Number(input.amount ?? shipment.price);
  const shipmentAmount = Number(shipment.price);
  if (amount !== shipmentAmount) {
    throw new AppError(
      'Payment amount must match the shipment price',
      400,
      'AMOUNT_MISMATCH',
    );
  }

  const existing = await paymentModel.findPaymentByShipmentId(shipment.id);
  const payload = {
    amount,
    currency: normalizeCurrency(input.currency),
    paymentMethod: input.paymentMethod,
    provider: input.provider ?? null,
    externalReference: input.externalReference ?? buildExternalReference(shipment.id),
    providerReference: input.providerReference ?? null,
    failureCode: null,
    failureMessage: null,
    refundReason: null,
    refundedAmount: 0,
    refundedAt: null,
    processedAt: null,
    metadata: {
      ...(existing?.metadata ?? {}),
      ...(input.metadata ?? {}),
      requestId,
    },
    status: 'pending',
  };

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let payment;
    if (existing) {
      if (!['failed', 'cancelled'].includes(existing.status)) {
        throw new AppError(
          'A payment workflow already exists for this shipment',
          409,
          'PAYMENT_ALREADY_EXISTS',
        );
      }
      payment = await paymentModel.updatePayment(client, existing.id, payload);
    } else {
      payment = await paymentModel.insertPayment(client, {
        shipmentId: shipment.id,
        amount: payload.amount,
        currency: payload.currency,
        paymentMethod: payload.paymentMethod,
        provider: payload.provider,
        externalReference: payload.externalReference,
        providerReference: payload.providerReference,
        metadata: payload.metadata,
        status: payload.status,
      });
    }

    await client.query('COMMIT');

    const sender = await userModel.findUserEmailAndNameById(shipment.senderId);
    if (sender?.email) {
      emailService.queuePaymentInitiatedEmail({
        to: sender.email,
        name: sender.name,
        payment,
        shipment,
        requestId,
      });
    }

    return payment;
  } catch (err) {
    await client.query('ROLLBACK');
    if (err?.code === '23505') {
      throw new AppError('Payment reference already exists', 409, 'PAYMENT_REFERENCE_CONFLICT');
    }
    throw err;
  } finally {
    client.release();
  }
}

export async function listPayments(actor, query) {
  const { rows, total } = await paymentModel.listPaymentsForActor({
    actor,
    paymentId: undefined,
    shipmentId: query.shipmentId,
    status: query.status,
    limit: query.limit,
    offset: query.offset,
  });
  return {
    data: rows,
    meta: paginationMeta({ total, limit: query.limit, offset: query.offset }),
  };
}

export async function getPaymentById(actor, id) {
  const payment = await paymentModel.findPaymentById(id);
  if (!payment) {
    throw new AppError('Payment not found', 404, 'NOT_FOUND');
  }
  await assertPaymentVisibility(actor, payment);
  return payment;
}

export async function updatePaymentStatus(actor, id, patch, requestId) {
  if (actor.role !== 'admin') {
    throw new AppError('Forbidden', 403, 'FORBIDDEN');
  }

  const payment = await paymentModel.findPaymentById(id);
  if (!payment) {
    throw new AppError('Payment not found', 404, 'NOT_FOUND');
  }
  if (!canTransition(payment.status, patch.status)) {
    throw new AppError(
      `Cannot transition payment from ${payment.status} to ${patch.status}`,
      400,
      'INVALID_PAYMENT_STATUS_TRANSITION',
    );
  }

  const shipment = await shipmentModel.findShipmentById(payment.shipmentId);
  const metadata = {
    ...(payment.metadata ?? {}),
    ...(patch.metadata ?? {}),
    lastStatusRequestId: requestId,
  };

  const update = {
    status: patch.status,
    metadata,
  };

  if ('providerReference' in patch) {
    update.providerReference = patch.providerReference ?? null;
  }
  if (patch.status === 'failed') {
    update.failureCode = patch.failureCode ?? 'PAYMENT_FAILED';
    update.failureMessage = patch.failureMessage ?? 'Payment processing failed';
    update.processedAt = null;
  } else {
    update.failureCode = null;
    update.failureMessage = null;
  }
  if (patch.status === 'completed') {
    update.processedAt = new Date();
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const updated = await paymentModel.updatePayment(client, id, update);
    await client.query('COMMIT');

    await sendPaymentStatusEmail(updated, shipment, patch.status, requestId);

    return updated;
  } catch (err) {
    await client.query('ROLLBACK');
    if (err?.code === '23505') {
      throw new AppError('Payment reference already exists', 409, 'PAYMENT_REFERENCE_CONFLICT');
    }
    throw err;
  } finally {
    client.release();
  }
}

export async function refundPayment(actor, id, patch, requestId) {
  if (actor.role !== 'admin') {
    throw new AppError('Forbidden', 403, 'FORBIDDEN');
  }

  const payment = await paymentModel.findPaymentById(id);
  if (!payment) {
    throw new AppError('Payment not found', 404, 'NOT_FOUND');
  }
  if (!['completed', 'partially_refunded'].includes(payment.status)) {
    throw new AppError(
      'Only completed payments can be refunded',
      400,
      'INVALID_REFUND_STATE',
    );
  }

  const refundAmount = Number(patch.amount);
  const nextRefundedAmount = Number(payment.refundedAmount) + refundAmount;
  if (nextRefundedAmount > Number(payment.amount)) {
    throw new AppError(
      'Refund amount exceeds captured payment total',
      400,
      'REFUND_EXCEEDS_PAYMENT',
    );
  }

  const shipment = await shipmentModel.findShipmentById(payment.shipmentId);
  const nextStatus =
    nextRefundedAmount === Number(payment.amount)
      ? 'refunded'
      : 'partially_refunded';

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const updated = await paymentModel.updatePayment(client, id, {
      refundedAmount: nextRefundedAmount,
      refundReason: patch.reason,
      refundedAt: new Date(),
      status: nextStatus,
      metadata: {
        ...(payment.metadata ?? {}),
        ...(patch.metadata ?? {}),
        lastRefundRequestId: requestId,
      },
    });
    await client.query('COMMIT');

    const sender = await userModel.findUserEmailAndNameById(shipment.senderId);
    if (sender?.email) {
      emailService.queuePaymentRefundedEmail({
        to: sender.email,
        name: sender.name,
        payment: updated,
        shipment,
        refundAmount,
        requestId,
      });
    }

    return updated;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
