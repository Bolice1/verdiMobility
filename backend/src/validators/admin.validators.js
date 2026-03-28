import { z } from 'zod';

import { parsePagination } from '../utils/pagination.js';

const pagination = z
  .object({
    limit: z.coerce.number().int().min(1).max(100).optional(),
    offset: z.coerce.number().int().min(0).optional(),
  })
  .transform((q) => parsePagination(q));

export const adminListQuerySchema = pagination;

export const adminStatsQuerySchema = z
  .object({
    days: z.coerce.number().int().min(1).max(365).optional().default(30),
  })
  .transform((q) => ({ days: q.days }));
