import { pool } from '../database/pool.js';
import * as shipmentModel from '../models/shipment.model.js';
import * as vehicleModel from '../models/vehicle.model.js';
import { AppError } from '../utils/AppError.js';
import { destinationsAreSimilar } from '../utils/destinationSimilarity.js';

function scoreVehicleForShipment(vehicle, shipment, pastDestinations) {
  if (Number(vehicle.capacity) < Number(shipment.weight)) {
    return null;
  }
  if (!pastDestinations.length) {
    return { vehicle, score: 0.4, reason: 'cold_start_capacity' };
  }
  const similar = pastDestinations.some((d) => destinationsAreSimilar(d, shipment.destination));
  if (!similar) {
    return null;
  }
  return { vehicle, score: 0.85, reason: 'history_destination_and_capacity' };
}

export async function runMatching({ shipmentId, limit }, actor) {
  if (actor.role !== 'admin' && actor.role !== 'company') {
    throw new AppError('Forbidden', 403, 'FORBIDDEN');
  }
  if (actor.role === 'company' && !actor.companyId) {
    throw new AppError('Forbidden', 403, 'FORBIDDEN');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const pending = await shipmentModel.listPendingShipments(client, {
      limit,
      shipmentId,
    });

    const usedVehicleIds = new Set();
    const matches = [];

    for (const shipment of pending) {
      let candidates = await vehicleModel.listCandidateVehiclesForMatching(client);
      if (actor.role === 'company') {
        candidates = candidates.filter((v) => v.companyId === actor.companyId);
      }
      candidates = candidates.filter((v) => !usedVehicleIds.has(v.id));

      const ranked = [];
      for (const vehicle of candidates) {
        const past = await vehicleModel.listPastDestinationsForVehicle(
          client,
          vehicle.id,
        );
        const scored = scoreVehicleForShipment(vehicle, shipment, past);
        if (scored) ranked.push(scored);
      }
      ranked.sort((a, b) => b.score - a.score);
      const best = ranked[0];
      if (best) {
        const updated = await shipmentModel.assignVehicleToShipment(
          client,
          shipment.id,
          best.vehicle.id,
        );
        await client.query(
          `UPDATE vehicles SET status = 'busy'::vehicle_status WHERE id = $1`,
          [best.vehicle.id],
        );
        usedVehicleIds.add(best.vehicle.id);
        matches.push({
          shipmentId: shipment.id,
          vehicleId: best.vehicle.id,
          score: best.score,
          reason: best.reason,
          shipment: updated,
        });
      } else {
        matches.push({
          shipmentId: shipment.id,
          vehicleId: null,
          score: 0,
          reason: 'no_eligible_vehicle',
        });
      }
    }

    await client.query('COMMIT');
    return { processed: pending.length, results: matches };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
