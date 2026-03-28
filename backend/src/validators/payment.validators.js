import { z } from 'zod';

import { parsePagination } from '../utils/pagination.js';

const paymentStatusEnum = z.enum([
  'pending',
  'authorized',
  'processing',
  'completed',
  'failed',
  'cancelled',
  'partially_refunded',
  'refunded',
]);

const paymentMethodEnum = z.enum([
  'card',
  'bank_transfer',
  'wallet',
  'mobile_money',
  'invoice',
]);

const metadataSchema = z.record(z.string(), z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]));

export const createPaymentSchema = z.object({
  shipmentId: z.string().uuid(),
  amount: z.coerce.number().positive().max(1_000_000_000).optional(),
  currency: z.string().trim().length(3).transform((value) => value.toUpperCase()).optional(),
  paymentMethod: paymentMethodEnum.default('invoice'),
  provider: z.string().trim().min(1).max(100).optional(),
  externalReference: z.string().trim().min(3).max(120).optional(),
  providerReference: z.string().trim().min(3).max(120).optional(),
  metadata: metadataSchema.optional(),
});

export const listPaymentsQuerySchema = z
  .object({
    limit: z.coerce.number().int().min(1).max(100).optional(),
    offset: z.coerce.number().int().min(0).optional(),
    shipmentId: z.string().uuid().optional(),
    status: paymentStatusEnum.optional(),
  })
  .transform((query) => ({
    ...parsePagination(query),
    shipmentId: query.shipmentId,
    status: query.status,
  }));

export const paymentIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const updatePaymentStatusSchema = z.object({
  status: paymentStatusEnum,
  providerReference: z.string().trim().min(3).max(120).optional(),
  failureCode: z.string().trim().min(2).max(100).optional(),
  failureMessage: z.string().trim().min(3).max(500).optional(),
  metadata: metadataSchema.optional(),
});

export const refundPaymentSchema = z.object({
  amount: z.coerce.number().positive().max(1_000_000_000),
  reason: z.string().trim().min(3).max(500),
  metadata: metadataSchema.optional(),
});
