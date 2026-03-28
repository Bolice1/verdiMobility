import { z } from 'zod';

import { parsePagination } from '../utils/pagination.js';

const vehicleStatus = z.enum(['available', 'busy', 'maintenance', 'inactive']);

export const createVehicleSchema = z.object({
  companyId: z.string().uuid(),
  driverId: z.string().uuid().nullable().optional(),
  plateNumber: z.string().min(2).max(32),
  capacity: z.coerce.number().positive().max(1_000_000),
  status: vehicleStatus.optional().default('available'),
  currentLatitude: z.coerce.number().min(-90).max(90).optional(),
  currentLongitude: z.coerce.number().min(-180).max(180).optional(),
  currentLocationLabel: z.string().min(2).max(120).optional(),
  availableCargoSpace: z.coerce.number().nonnegative().max(1_000_000).optional(),
});

export const listVehiclesQuerySchema = z
  .object({
    companyId: z.string().uuid().optional(),
    status: vehicleStatus.optional(),
    destination: z.string().min(1).max(255).optional(),
    minAvailableCapacity: z.coerce.number().nonnegative().max(1_000_000).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    offset: z.coerce.number().int().min(0).optional(),
  })
  .transform((q) => ({
    ...parsePagination(q),
    companyId: q.companyId,
    status: q.status,
    destination: q.destination,
    minAvailableCapacity: q.minAvailableCapacity,
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
    currentLatitude: z.coerce.number().min(-90).max(90).nullable().optional(),
    currentLongitude: z.coerce.number().min(-180).max(180).nullable().optional(),
    currentLocationLabel: z.string().min(2).max(120).nullable().optional(),
    availableCargoSpace: z.coerce.number().nonnegative().max(1_000_000).optional(),
  })
  .refine((o) => Object.keys(o).length > 0, {
    message: 'At least one field is required',
  });

export const marketplaceVehiclesQuerySchema = z
  .object({
    destination: z.string().min(1).max(255).optional(),
    minAvailableCapacity: z.coerce.number().nonnegative().max(1_000_000).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    offset: z.coerce.number().int().min(0).optional(),
  })
  .transform((q) => ({
    ...parsePagination(q),
    destination: q.destination,
    minAvailableCapacity: q.minAvailableCapacity,
  }));
