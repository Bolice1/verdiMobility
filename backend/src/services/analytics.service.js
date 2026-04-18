import { pool } from '../database/pool.js';

export async function impactSummary(actor) {
  const values = [];
  let fromSql = 'FROM shipments s';
  let whereSql = '';

  if (actor?.role === 'company') {
    fromSql += ' INNER JOIN vehicles v ON v.id = s.vehicle_id';
    whereSql = 'WHERE v.company_id = $1';
    values.push(actor.companyId);
  }

  const { rows } = await pool.query(
    `SELECT
        COUNT(*)::int AS total_shipments,
        COUNT(*) FILTER (WHERE s.status = 'delivered')::int AS delivered_shipments,
        COALESCE(SUM(s.co2_saved_kg), 0) AS co2_saved_kg,
        COALESCE(SUM(s.fuel_saved_l), 0) AS fuel_saved_l,
        COALESCE(SUM(s.distance_km), 0) AS distance_km
     ${fromSql}
     ${whereSql}`,
    values,
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
