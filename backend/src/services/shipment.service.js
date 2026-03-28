import { pool } from '../database/pool.js';
import * as driverModel from '../models/driver.model.js';
import * as shipmentModel from '../models/shipment.model.js';
import * as vehicleModel from '../models/vehicle.model.js';
import { env } from '../config/index.js';
import { AppError } from '../utils/AppError.js';
import { paginationMeta } from '../utils/pagination.js';
import { getDrivingMetrics } from '../utils/maps.js';
import { estimateImpact } from '../utils/impact.js';

const ALLOWED = {
  pending: new Set(['matched', 'cancelled']),
  matched: new Set(['in_transit', 'cancelled']),
  in_transit: new Set(['delivered', 'cancelled']),
  delivered: new Set([]),
  cancelled: new Set([]),
};

function canTransition(from, to) {
  return ALLOWED[from]?.has(to) ?? false;
}

async function assertShipmentVisibility(actor, shipment) {
  if (actor.role === 'admin') return;

  if (actor.role === 'user' && shipment.senderId === actor.id) return;

  if (actor.role === 'company' && actor.companyId && shipment.vehicleId) {
    const vehicle = await vehicleModel.findVehicleById(shipment.vehicleId);
    if (vehicle && vehicle.companyId === actor.companyId) return;
  }

  if (actor.role === 'driver' && shipment.vehicleId) {
    const vehicle = await vehicleModel.findVehicleById(shipment.vehicleId);
    if (!vehicle?.driverId) {
      throw new AppError('Forbidden', 403, 'FORBIDDEN');
    }
    const driver = await driverModel.findDriverById(vehicle.driverId);
    if (driver && driver.userId === actor.id) return;
  }

  throw new AppError('Forbidden', 403, 'FORBIDDEN');
}

export async function createShipment(actor, input) {
  if (actor.role !== 'user' && actor.role !== 'admin') {
    throw new AppError('Only senders can create shipments', 403, 'FORBIDDEN');
  }
  const senderId = actor.id;

  let distanceKm = null;
  let baselineDistanceKm = null;
  let fuelSavedLiters = null;
  let co2SavedKg = null;

  if (env.googleMapsApiKey) {
    try {
      const metrics = await getDrivingMetrics({
        origin: input.pickupLocation,
        destination: input.destination,
      });
      if (metrics?.distanceKm) {
        distanceKm = metrics.distanceKm;
        baselineDistanceKm = metrics.distanceKm;
        const impact = estimateImpact({
          distanceKm,
          baselineDistanceKm,
          litersPer100km: env.vehicleLitersPer100km,
        });
        fuelSavedLiters = impact.fuelSavedLiters ?? null;
        co2SavedKg = impact.co2SavedKg ?? null;
      }
    } catch (e) {
      // Soft-fail on distance lookup; still create shipment
      console.warn('maps_distance_failed', e?.message ?? e);
    }
  }

  const client = await pool.connect();
  try {
    const created = await shipmentModel.insertShipment(client, {
      senderId,
      pickupLocation: input.pickupLocation,
      destination: input.destination,
      weight: input.weight,
      price: input.price,
      distanceKm,
      baselineDistanceKm,
      fuelSavedLiters,
      co2SavedKg,
    });
    return created;
  } finally {
    client.release();
  }
}

export async function listShipments(actor, query) {
  const { limit, offset, status } = query;
  const { rows, total } = await shipmentModel.listShipmentsForActor({
    actor,
    limit,
    offset,
    status,
  });
  return {
    data: rows,
    meta: paginationMeta({ total, limit, offset }),
  };
}

export async function getShipmentById(actor, id) {
  const shipment = await shipmentModel.findShipmentById(id);
  if (!shipment) {
    throw new AppError('Shipment not found', 404, 'NOT_FOUND');
  }
  await assertShipmentVisibility(actor, shipment);
  return shipment;
}

export async function updateShipmentStatus(actor, id, nextStatus) {
  const shipment = await shipmentModel.findShipmentById(id);
  if (!shipment) {
    throw new AppError('Shipment not found', 404, 'NOT_FOUND');
  }
  await assertShipmentVisibility(actor, shipment);

  if (!canTransition(shipment.status, nextStatus)) {
    throw new AppError(
      `Cannot transition from ${shipment.status} to ${nextStatus}`,
      400,
      'INVALID_STATUS_TRANSITION',
    );
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const updated = await shipmentModel.updateShipmentStatus(client, id, nextStatus);
    if (
      updated?.vehicleId &&
      (nextStatus === 'delivered' || nextStatus === 'cancelled')
    ) {
      await client.query(
        `UPDATE vehicles SET status = 'available'::vehicle_status WHERE id = $1`,
        [updated.vehicleId],
      );
    }
    await client.query('COMMIT');
    return updated;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export async function updateShipmentImpact(actor, id, patch) {
  if (actor.role !== 'admin') {
    throw new AppError('Forbidden', 403, 'FORBIDDEN');
  }

  const shipment = await shipmentModel.findShipmentById(id);
  if (!shipment) {
    throw new AppError('Shipment not found', 404, 'NOT_FOUND');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const updated = await shipmentModel.updateShipmentImpact(client, id, patch);
    await client.query('COMMIT');
    return updated;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
