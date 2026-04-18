import { z } from 'zod';

import { parsePagination } from '../utils/pagination.js';

const vehicleStatus = z.enum(['available', 'busy', 'maintenance', 'inactive']);

export const createVehicleSchema = z.object({
  companyId: z.string().uuid(),
  driverId: z.string().uuid().nullable().optional(),
  plateNumber: z.string().min(2).max(32),
  capacity: z.coerce.number().positive().max(1_000_000),
  status: vehicleStatus.optional().default('available'),
});

export const listVehiclesQuerySchema = z
  .object({
    companyId: z.string().uuid().optional(),
    status: vehicleStatus.optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    offset: z.coerce.number().int().min(0).optional(),
  })
  .transform((q) => ({
    ...parsePagination(q),
    companyId: q.companyId,
    status: q.status,
  }));

export const vehicleIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const patchVehicleSchema = z
  .object({
    driverId: z.string().uuid().nullable().optional(),
    plateNumber: z.string().min(2).max(32).optional(),
    capacity: z.coerce.number().positive().max(1_000_000).optional(),
    status: vehicleStatus.optional(),
  })
  .refine((o) => Object.keys(o).length > 0, {
    message: 'At least one field is required',
  });
