import { pool } from '../database/pool.js';

const PAYMENT_SELECT = `p.id,
  p.shipment_id AS "shipmentId",
  p.amount,
  p.currency,
  p.payment_method AS "paymentMethod",
  p.provider,
  p.external_reference AS "externalReference",
  p.provider_reference AS "providerReference",
  p.status,
  p.refunded_amount AS "refundedAmount",
  p.failure_code AS "failureCode",
  p.failure_message AS "failureMessage",
  p.refund_reason AS "refundReason",
  p.metadata,
  p.processed_at AS "processedAt",
  p.refunded_at AS "refundedAt",
  p.created_at AS "createdAt",
  p.updated_at AS "updatedAt"`;

export async function insertPayment(
  client,
  {
    shipmentId,
    amount,
    currency,
    paymentMethod,
    provider,
    externalReference,
    providerReference,
    metadata,
    status,
  },
) {
  const { rows } = await client.query(
    `INSERT INTO payments (
       shipment_id,
       amount,
       currency,
       payment_method,
       provider,
       external_reference,
       provider_reference,
       metadata,
       status
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING ${PAYMENT_SELECT}`,
    [
      shipmentId,
      amount,
      currency,
      paymentMethod,
      provider ?? null,
      externalReference ?? null,
      providerReference ?? null,
      metadata ?? {},
      status ?? 'pending',
    ],
  );
  return rows[0];
}

export async function findPaymentById(id) {
  const { rows } = await pool.query(
    `SELECT ${PAYMENT_SELECT}
     FROM payments p
     WHERE p.id = $1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function findPaymentByShipmentId(shipmentId) {
  const { rows } = await pool.query(
    `SELECT ${PAYMENT_SELECT}
     FROM payments p
     WHERE p.shipment_id = $1`,
    [shipmentId],
  );
  return rows[0] ?? null;
}

export async function updatePayment(client, id, patch) {
  const fields = [];
  const values = [];
  let index = 1;

  const mappings = [
    ['amount', 'amount'],
    ['currency', 'currency'],
    ['paymentMethod', 'payment_method'],
    ['provider', 'provider'],
    ['externalReference', 'external_reference'],
    ['providerReference', 'provider_reference'],
    ['status', 'status'],
    ['refundedAmount', 'refunded_amount'],
    ['failureCode', 'failure_code'],
    ['failureMessage', 'failure_message'],
    ['refundReason', 'refund_reason'],
    ['metadata', 'metadata'],
    ['processedAt', 'processed_at'],
    ['refundedAt', 'refunded_at'],
  ];

  for (const [key, column] of mappings) {
    if (key in patch) {
      fields.push(`${column} = $${index++}`);
      values.push(patch[key]);
    }
  }

  if (!fields.length) {
    return null;
  }

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const { rows } = await client.query(
    `UPDATE payments p
     SET ${fields.join(', ')}
     WHERE p.id = $${index}
     RETURNING ${PAYMENT_SELECT}`,
    values,
  );
  return rows[0] ?? null;
}

export async function listPaymentsForActor({
  actor,
  paymentId,
  shipmentId,
  status,
  limit,
  offset,
}) {
  const conditions = [];
  const values = [];
  let idx = 1;

  let fromSql = `
    FROM payments p
    INNER JOIN shipments s ON s.id = p.shipment_id
  `;

  if (actor.role === 'user') {
    conditions.push(`s.sender_id = $${idx++}`);
    values.push(actor.id);
  } else if (actor.role === 'company') {
    if (!actor.companyId) {
      return { rows: [], total: 0 };
    }
    fromSql += ' INNER JOIN vehicles v ON v.id = s.vehicle_id';
    conditions.push(`v.company_id = $${idx++}`);
    values.push(actor.companyId);
  } else if (actor.role === 'driver') {
    fromSql += `
      INNER JOIN vehicles v ON v.id = s.vehicle_id
      INNER JOIN drivers d ON d.id = v.driver_id
    `;
    conditions.push(`d.user_id = $${idx++}`);
    values.push(actor.id);
  }

  if (paymentId) {
    conditions.push(`p.id = $${idx++}`);
    values.push(paymentId);
  }
  if (shipmentId) {
    conditions.push(`p.shipment_id = $${idx++}`);
    values.push(shipmentId);
  }
  if (status) {
    conditions.push(`p.status = $${idx++}`);
    values.push(status);
  }

  const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS c
     ${fromSql}
     ${whereSql}`,
    values,
  );
  const total = countResult.rows[0].c;

  values.push(limit, offset);
  const { rows } = await pool.query(
    `SELECT ${PAYMENT_SELECT}
     ${fromSql}
     ${whereSql}
     ORDER BY p.created_at DESC
     LIMIT $${idx++} OFFSET $${idx}`,
    values,
  );
  return { rows, total };
}
