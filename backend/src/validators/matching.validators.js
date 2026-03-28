import { z } from 'zod';

export const runMatchingSchema = z.object({
  shipmentId: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(25),
});
