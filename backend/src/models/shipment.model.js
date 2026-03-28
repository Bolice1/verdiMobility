import { pool } from '../database/pool.js';

export async function insertShipment(
  client,
  { senderId, pickupLocation, destination, weight, price },
) {
  const { rows } = await client.query(
    `INSERT INTO shipments (sender_id, pickup_location, destination, weight, price)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, sender_id AS "senderId", vehicle_id AS "vehicleId", pickup_location AS "pickupLocation",
               destination, weight, status, price, created_at AS "createdAt"`,
    [senderId, pickupLocation, destination, weight, price],
  );
  return rows[0];
}

export async function findShipmentById(id) {
  const { rows } = await pool.query(
    `SELECT id, sender_id AS "senderId", vehicle_id AS "vehicleId", pickup_location AS "pickupLocation",
            destination, weight, status, price, created_at AS "createdAt"
     FROM shipments WHERE id = $1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function updateShipmentStatus(client, id, status) {
  const { rows } = await client.query(
    `UPDATE shipments SET status = $2 WHERE id = $1
     RETURNING id, sender_id AS "senderId", vehicle_id AS "vehicleId", pickup_location AS "pickupLocation",
               destination, weight, status, price, created_at AS "createdAt"`,
    [id, status],
  );
  return rows[0] ?? null;
}

export async function assignVehicleToShipment(client, shipmentId, vehicleId) {
  const { rows } = await client.query(
    `UPDATE shipments
     SET vehicle_id = $2, status = CASE WHEN status = 'pending' THEN 'matched'::shipment_status ELSE status END
     WHERE id = $1
     RETURNING id, sender_id AS "senderId", vehicle_id AS "vehicleId", pickup_location AS "pickupLocation",
               destination, weight, status, price, created_at AS "createdAt"`,
    [shipmentId, vehicleId],
  );
  return rows[0] ?? null;
}

export async function listPendingShipments(client, { limit, shipmentId }) {
  if (shipmentId) {
    const { rows } = await client.query(
      `SELECT id, sender_id AS "senderId", vehicle_id AS "vehicleId", pickup_location AS "pickupLocation",
              destination, weight, status, price, created_at AS "createdAt"
       FROM shipments
       WHERE id = $1 AND status = 'pending'
       LIMIT 1`,
      [shipmentId],
    );
    return rows;
  }
  const { rows } = await client.query(
    `SELECT id, sender_id AS "senderId", vehicle_id AS "vehicleId", pickup_location AS "pickupLocation",
            destination, weight, status, price, created_at AS "createdAt"
     FROM shipments
     WHERE status = 'pending'
     ORDER BY created_at ASC
     LIMIT $1`,
    [limit],
  );
  return rows;
}

export async function listShipmentsForActor({ actor, limit, offset, status }) {
  const conditions = [];
  const values = [];
  let idx = 1;

  let fromSql = 'FROM shipments s';

  if (actor.role === 'admin') {
    // all shipments
  } else if (actor.role === 'user') {
    conditions.push(`s.sender_id = $${idx++}`);
    values.push(actor.id);
  } else if (actor.role === 'company') {
    if (!actor.companyId) {
      return { rows: [], total: 0 };
    }
    fromSql += ' INNER JOIN vehicles v ON v.id = s.vehicle_id';
    conditions.push(`v.company_id = $${idx++}`);
    values.push(actor.companyId);
  } else if (actor.role === 'driver') {
    fromSql += `
      INNER JOIN vehicles v ON v.id = s.vehicle_id
      INNER JOIN drivers d ON d.id = v.driver_id`;
    conditions.push(`d.user_id = $${idx++}`);
    values.push(actor.id);
  } else {
    return { rows: [], total: 0 };
  }

  if (status) {
    conditions.push(`s.status = $${idx++}`);
    values.push(status);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS c ${fromSql} ${where}`,
    values,
  );
  const total = countResult.rows[0].c;

  values.push(limit, offset);
  const { rows } = await pool.query(
    `SELECT s.id, s.sender_id AS "senderId", s.vehicle_id AS "vehicleId",
            s.pickup_location AS "pickupLocation", s.destination, s.weight, s.status, s.price,
            s.created_at AS "createdAt"
     ${fromSql}
     ${where}
     ORDER BY s.created_at DESC
     LIMIT $${idx++} OFFSET $${idx}`,
    values,
  );
  return { rows, total };
}
