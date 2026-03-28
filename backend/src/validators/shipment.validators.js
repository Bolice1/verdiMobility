import { z } from 'zod';

import { parsePagination } from '../utils/pagination.js';

const statusEnum = z.enum([
  'pending',
  'matched',
  'in_transit',
  'delivered',
  'cancelled',
]);

export const createShipmentSchema = z.object({
  pickupLocation: z.string().min(1).max(500),
  destination: z.string().min(1).max(500),
  weight: z.coerce.number().positive().max(1_000_000),
  price: z.coerce.number().nonnegative().max(1_000_000_000),
});

export const listShipmentsQuerySchema = z
  .object({
    limit: z.coerce.number().int().min(1).max(100).optional(),
    offset: z.coerce.number().int().min(0).optional(),
    status: statusEnum.optional(),
  })
  .transform((q) => ({
    ...parsePagination(q),
    status: q.status,
  }));

export const shipmentIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const patchShipmentStatusSchema = z.object({
  status: statusEnum,
});
