import { pool } from '../database/pool.js';

export async function insertPayment(client, { shipmentId, amount, status }) {
  const { rows } = await client.query(
    `INSERT INTO payments (shipment_id, amount, status)
     VALUES ($1, $2, $3)
     RETURNING id, shipment_id AS "shipmentId", amount, status`,
    [shipmentId, amount, status ?? 'pending'],
  );
  return rows[0];
}

export async function findPaymentByShipmentId(shipmentId) {
  const { rows } = await pool.query(
    `SELECT id, shipment_id AS "shipmentId", amount, status FROM payments WHERE shipment_id = $1`,
    [shipmentId],
  );
  return rows[0] ?? null;
}
