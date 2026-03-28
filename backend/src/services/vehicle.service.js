import { pool } from '../database/pool.js';
import * as driverModel from '../models/driver.model.js';
import * as vehicleModel from '../models/vehicle.model.js';
import { AppError } from '../utils/AppError.js';
import { paginationMeta } from '../utils/pagination.js';

function assertCompanyAccess(actor, companyId) {
  if (actor.role === 'admin') return;
  if (actor.role === 'company' && actor.companyId === companyId) return;
  throw new AppError('Forbidden', 403, 'FORBIDDEN');
}

export async function createVehicle(actor, input) {
  assertCompanyAccess(actor, input.companyId);
  if (input.driverId) {
    const driver = await driverModel.findDriverById(input.driverId);
    if (!driver) {
      throw new AppError('Driver not found', 404, 'NOT_FOUND');
    }
  }
  const client = await pool.connect();
  try {
    const vehicle = await vehicleModel.insertVehicle(client, {
      companyId: input.companyId,
      driverId: input.driverId ?? null,
      plateNumber: input.plateNumber,
      capacity: input.capacity,
      status: input.status,
      currentLatitude: input.currentLatitude,
      currentLongitude: input.currentLongitude,
      currentLocationLabel: input.currentLocationLabel,
      availableCargoSpace: input.availableCargoSpace,
    });
    return vehicle;
  } catch (err) {
    if (err.code === '23505') {
      throw new AppError('Vehicle plate must be unique', 409, 'PLATE_IN_USE');
    }
    if (err.code === '23503') {
      throw new AppError('Invalid reference', 400, 'INVALID_REFERENCE');
    }
    throw err;
  } finally {
    client.release();
  }
}

export async function listVehicles(actor, query) {
  let { companyId, status, destination, minAvailableCapacity, limit, offset } = query;
  let driverId;

  if (actor.role === 'company') {
    if (!actor.companyId) {
      return { data: [], meta: paginationMeta({ total: 0, limit, offset }) };
    }
    companyId = actor.companyId;
  } else if (actor.role === 'driver') {
    const driver = await driverModel.findDriverByUserId(actor.id);
    if (!driver) {
      return { data: [], meta: paginationMeta({ total: 0, limit, offset }) };
    }
    driverId = driver.id;
  } else if (actor.role === 'user') {
    throw new AppError('Forbidden', 403, 'FORBIDDEN');
  } else if (actor.role === 'admin' && !companyId) {
    // list all — no filter
  }

  const { rows, total } = await vehicleModel.listVehiclesForQuery({
    companyId: companyId ?? undefined,
    driverId,
    status: status ?? undefined,
    destination: destination ?? undefined,
    minAvailableCapacity,
    limit,
    offset,
  });
  return {
    data: rows,
    meta: paginationMeta({ total, limit, offset }),
  };
}

export async function updateVehicle(actor, vehicleId, patch) {
  const vehicle = await vehicleModel.findVehicleById(vehicleId);
  if (!vehicle) {
    throw new AppError('Vehicle not found', 404, 'NOT_FOUND');
  }
  assertCompanyAccess(actor, vehicle.companyId);

  if (patch.driverId) {
    const driver = await driverModel.findDriverById(patch.driverId);
    if (!driver) {
      throw new AppError('Driver not found', 404, 'NOT_FOUND');
    }
  }

  const client = await pool.connect();
  try {
    const updated = await vehicleModel.updateVehicle(client, vehicleId, patch);
    return updated;
  } catch (err) {
    if (err.code === '23505') {
      throw new AppError('Vehicle plate must be unique', 409, 'PLATE_IN_USE');
    }
    throw err;
  } finally {
    client.release();
  }
}

export async function listMarketplaceVehicles(query) {
  const { rows, total } = await vehicleModel.listMarketplaceVehicles(query);
  return {
    data: rows,
    meta: paginationMeta({ total, limit: query.limit, offset: query.offset }),
  };
}
