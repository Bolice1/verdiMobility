import { z } from 'zod';

import { parsePagination } from '../utils/pagination.js';

export const createRatingSchema = z.object({
  shipmentId: z.string().uuid(),
  rating: z.coerce.number().min(0).max(5),
  review: z.string().max(1000).optional(),
});

export const listDriverRatingsSchema = z
  .object({
    limit: z.coerce.number().int().min(1).max(100).optional(),
    offset: z.coerce.number().int().min(0).optional(),
  })
  .transform(parsePagination);

export const driverIdParamsSchema = z.object({
  driverId: z.string().uuid(),
});
