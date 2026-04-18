import { z } from 'zod';

import { parsePagination } from '../utils/pagination.js';

export const listUsersQuerySchema = z
  .object({
    limit: z.coerce.number().int().min(1).max(100).optional(),
    offset: z.coerce.number().int().min(0).optional(),
  })
  .transform((q) => parsePagination(q));
