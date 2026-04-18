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

export const adminUserIdParamsSchema = z.object({
  id: z.string().uuid(),
});

const roleEnum = z.enum(['admin', 'user', 'driver', 'company']);

export const adminPatchUserBodySchema = z
  .object({
    role: roleEnum.optional(),
    suspended: z.boolean().optional(),
    suspendedReason: z.string().max(1000).optional(),
  })
  .refine((o) => Object.keys(o).length > 0, {
    message: 'At least one field is required',
  });
