import { pool } from '../database/pool.js';

export async function insertRating(client, { driverId, shipmentId, rating, review }) {
  const { rows } = await client.query(
    `INSERT INTO ratings (driver_id, shipment_id, rating, review)
     VALUES ($1, $2, $3, $4)
     RETURNING id, driver_id AS "driverId", shipment_id AS "shipmentId", rating, review`,
    [driverId, shipmentId, rating, review ?? null],
  );
  return rows[0];
}

export async function averageRatingForDriver(driverId) {
  const { rows } = await pool.query(
    `SELECT COALESCE(AVG(rating), 0)::numeric(10,2) AS avg FROM ratings WHERE driver_id = $1`,
    [driverId],
  );
  return rows[0]?.avg ?? 0;
}
