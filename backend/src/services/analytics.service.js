import { pool } from '../database/pool.js';

export async function impactSummary() {
  const { rows } = await pool.query(
    `SELECT
        COUNT(*)::int AS total_shipments,
        COUNT(*) FILTER (WHERE status = 'delivered')::int AS delivered_shipments,
        COALESCE(SUM(co2_saved_kg), 0) AS co2_saved_kg,
        COALESCE(SUM(fuel_saved_l), 0) AS fuel_saved_l,
        COALESCE(SUM(distance_km), 0) AS distance_km
     FROM shipments`,
  );
  const r = rows[0];
  return {
    totalShipments: r.total_shipments,
    deliveredShipments: r.delivered_shipments,
    co2SavedKg: Number(r.co2_saved_kg),
    fuelSavedLiters: Number(r.fuel_saved_l),
    distanceKm: Number(r.distance_km),
  };
}
