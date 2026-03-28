import { pool } from '../database/pool.js';
import * as driverModel from '../models/driver.model.js';
import * as ratingModel from '../models/rating.model.js';
import * as shipmentModel from '../models/shipment.model.js';
import * as vehicleModel from '../models/vehicle.model.js';
import { AppError } from '../utils/AppError.js';

function assertActorCanRate(actor, shipment) {
  if (actor.role === 'admin') return;
  if (actor.role === 'user' && shipment.senderId === actor.id) return;
  throw new AppError('Forbidden', 403, 'FORBIDDEN');
}

export async function createRating(actor, { shipmentId, rating, review }) {
  const shipment = await shipmentModel.findShipmentById(shipmentId);
  if (!shipment) {
    throw new AppError('Shipment not found', 404, 'NOT_FOUND');
  }

  assertActorCanRate(actor, shipment);

  if (shipment.status !== 'delivered') {
    throw new AppError('Can only rate delivered shipments', 400, 'INVALID_STATUS');
  }
  if (!shipment.vehicleId) {
    throw new AppError('Shipment has no assigned vehicle', 400, 'NO_VEHICLE');
  }

  const vehicle = await vehicleModel.findVehicleById(shipment.vehicleId);
  if (!vehicle?.driverId) {
    throw new AppError('Shipment vehicle has no driver', 400, 'NO_DRIVER');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const created = await ratingModel.insertRating(client, {
      driverId: vehicle.driverId,
      shipmentId,
      rating,
      review,
    });
    const avg = await ratingModel.averageRatingForDriver(vehicle.driverId, client);
    await driverModel.updateDriverRating(client, vehicle.driverId, avg);
    await client.query('COMMIT');
    return { rating: created, driverAverage: Number(avg) };
  } catch (err) {
    await client.query('ROLLBACK');
    if (err?.code === '23505') {
      throw new AppError('Rating already exists for this shipment', 400, 'DUPLICATE_RATING');
    }
    throw err;
  } finally {
    client.release();
  }
}

export async function listRatingsForDriver(driverId, { limit, offset }) {
  const driver = await driverModel.findDriverById(driverId);
  if (!driver) {
    throw new AppError('Driver not found', 404, 'NOT_FOUND');
  }
  const rows = await ratingModel.listRatingsForDriver(driverId, { limit, offset });
  const average = await ratingModel.averageRatingForDriver(driverId);
  return { data: rows, average: Number(average) };
}
