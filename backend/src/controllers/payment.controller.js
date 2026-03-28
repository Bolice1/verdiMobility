import * as paymentService from '../services/payment.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const create = asyncHandler(async (req, res) => {
  const created = await paymentService.createPayment(req.user, req.body, req.id);
  res.status(201).json(created);
});

export const list = asyncHandler(async (req, res) => {
  const result = await paymentService.listPayments(req.user, req.query);
  res.json(result);
});

export const getById = asyncHandler(async (req, res) => {
  const payment = await paymentService.getPaymentById(req.user, req.params.id);
  res.json(payment);
});

export const patchStatus = asyncHandler(async (req, res) => {
  const payment = await paymentService.updatePaymentStatus(
    req.user,
    req.params.id,
    req.body,
    req.id,
  );
  res.json(payment);
});

export const refund = asyncHandler(async (req, res) => {
  const payment = await paymentService.refundPayment(
    req.user,
    req.params.id,
    req.body,
    req.id,
  );
  res.json(payment);
});
