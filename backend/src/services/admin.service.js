import { pool } from '../database/pool.js';

function num(v) {
  if (v === null || v === undefined) return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export async function getOverview() {
  const [
    usersR,
    companiesR,
    vehiclesR,
    shipmentsR,
    revenueR,
    activeR,
    availableR,
  ] = await Promise.all([
    pool.query(`SELECT COUNT(*)::int AS c FROM users`),
    pool.query(`SELECT COUNT(*)::int AS c FROM companies`),
    pool.query(`SELECT COUNT(*)::int AS c FROM vehicles`),
    pool.query(`SELECT COUNT(*)::int AS c FROM shipments`),
    pool.query(
      `SELECT COALESCE(SUM(amount), 0)::numeric AS s FROM payments WHERE status = 'completed'`,
    ),
    pool.query(`SELECT COUNT(*)::int AS c FROM vehicles WHERE status = 'busy'`),
    pool.query(
      `SELECT COUNT(*)::int AS c FROM vehicles WHERE status = 'available'`,
    ),
  ]);

  return {
    total_users: usersR.rows[0].c,
    total_companies: companiesR.rows[0].c,
    total_vehicles: vehiclesR.rows[0].c,
    total_shipments: shipmentsR.rows[0].c,
    total_revenue: num(revenueR.rows[0].s),
    active_vehicles: activeR.rows[0].c,
    available_vehicles: availableR.rows[0].c,
  };
}

export async function listCompaniesGlobal({ limit, offset }) {
  const countR = await pool.query(`SELECT COUNT(*)::int AS c FROM companies`);
  const { rows } = await pool.query(
    `SELECT c.id, c.name, c.email, c.created_at AS "createdAt",
            COUNT(v.id)::int AS "vehicleCount"
     FROM companies c
     LEFT JOIN vehicles v ON v.company_id = c.id
     GROUP BY c.id
     ORDER BY c.name ASC
     LIMIT $1 OFFSET $2`,
    [limit, offset],
  );
  return {
    items: rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      createdAt: r.createdAt,
      vehicleCount: r.vehicleCount,
    })),
    total: countR.rows[0].c,
  };
}

export async function listVehiclesGlobal({ limit, offset }) {
  const countR = await pool.query(`SELECT COUNT(*)::int AS c FROM vehicles`);
  const { rows } = await pool.query(
    `SELECT
      v.id,
      v.company_id AS "companyId",
      v.plate_number AS "plateNumber",
      v.capacity AS "capacity",
       v.status,
       ast.pickup_location AS "routeFrom",
       ast.destination AS "routeTo",
       ast.weight AS "assignedWeight",
       CASE
         WHEN ast.weight IS NULL THEN v.capacity
         ELSE GREATEST(v.capacity - ast.weight, 0)
       END AS "availableCapacity"
     FROM vehicles v
     LEFT JOIN LATERAL (
       SELECT pickup_location, destination, weight
       FROM shipments
       WHERE vehicle_id = v.id AND status IN ('matched', 'in_transit')
       ORDER BY created_at DESC
       LIMIT 1
     ) ast ON true
     ORDER BY v.plate_number ASC
     LIMIT $1 OFFSET $2`,
    [limit, offset],
  );
  return {
    items: rows.map((r) => ({
      id: r.id,
      companyId: r.companyId,
      plateNumber: r.plateNumber,
      status: r.status,
      route:
        r.routeFrom && r.routeTo
          ? { from: r.routeFrom, to: r.routeTo }
          : null,
      available_capacity: num(r.availableCapacity),
    })),
    total: countR.rows[0].c,
  };
}

export async function listShipmentsGlobal({ limit, offset }) {
  const countR = await pool.query(`SELECT COUNT(*)::int AS c FROM shipments`);
  const { rows } = await pool.query(
    `SELECT
      s.id,
      s.status,
      s.pickup_location AS "pickupLocation",
      s.destination,
      s.weight,
      s.price,
      s.created_at AS "createdAt",
      json_build_object(
        'id', u.id,
        'name', u.name,
        'email', u.email
      ) AS sender,
      CASE
        WHEN v.id IS NULL THEN NULL
        ELSE json_build_object(
          'id', v.id,
          'plateNumber', v.plate_number,
          'companyId', v.company_id,
          'status', v.status
        )
      END AS vehicle
     FROM shipments s
     INNER JOIN users u ON u.id = s.sender_id
     LEFT JOIN vehicles v ON v.id = s.vehicle_id
     ORDER BY s.created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset],
  );
  return {
    items: rows.map((r) => ({
      id: r.id,
      status: r.status,
      pickupLocation: r.pickupLocation,
      destination: r.destination,
      weight: num(r.weight),
      price: num(r.price),
      createdAt: r.createdAt,
      sender: r.sender,
      vehicle: r.vehicle,
    })),
    total: countR.rows[0].c,
  };
}

export async function listPaymentsGlobal({ limit, offset }) {
  const [listR, summaryR] = await Promise.all([
    pool.query(
      `SELECT p.id, p.shipment_id AS "shipmentId", p.amount, p.status
       FROM payments p
       ORDER BY p.id ASC
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    ),
    pool.query(
      `SELECT
        status,
        COUNT(*)::int AS count,
        COALESCE(SUM(amount), 0)::numeric AS total_amount
       FROM payments
       GROUP BY status`,
    ),
  ]);

  const byStatus = {};
  let totalAmountAll = 0;
  for (const row of summaryR.rows) {
    byStatus[row.status] = {
      count: row.count,
      totalAmount: num(row.total_amount),
    };
    totalAmountAll += num(row.total_amount);
  }

  return {
    items: listR.rows.map((r) => ({
      id: r.id,
      shipmentId: r.shipmentId,
      amount: num(r.amount),
      status: r.status,
    })),
    summary: {
      totalRecords: Object.values(byStatus).reduce((a, b) => a + b.count, 0),
      totalAmountAll,
      byStatus,
    },
  };
}

export async function getStats({ days }) {
  const [shipDay, revDay, routes, utilR] = await Promise.all([
    pool.query(
      `SELECT
        (created_at AT TIME ZONE 'UTC')::date AS day,
        COUNT(*)::int AS count
       FROM shipments
       WHERE created_at >= CURRENT_TIMESTAMP - ($1::int * INTERVAL '1 day')
       GROUP BY 1
       ORDER BY 1 ASC`,
      [days],
    ),
    pool.query(
      `SELECT
        (s.created_at AT TIME ZONE 'UTC')::date AS day,
        COALESCE(SUM(p.amount), 0)::numeric AS revenue
       FROM payments p
       INNER JOIN shipments s ON s.id = p.shipment_id
       WHERE p.status = 'completed'
         AND s.created_at >= CURRENT_TIMESTAMP - ($1::int * INTERVAL '1 day')
       GROUP BY 1
       ORDER BY 1 ASC`,
      [days],
    ),
    pool.query(
      `SELECT
        pickup_location AS route_from,
        destination AS route_to,
        COUNT(*)::int AS shipment_count
       FROM shipments
       WHERE created_at >= CURRENT_TIMESTAMP - ($1::int * INTERVAL '1 day')
       GROUP BY pickup_location, destination
       ORDER BY shipment_count DESC
       LIMIT 10`,
      [days],
    ),
    pool.query(
      `SELECT
        CASE
          WHEN COUNT(*) FILTER (WHERE status <> 'inactive') = 0 THEN 0::numeric
          ELSE ROUND(
            (100.0 * COUNT(*) FILTER (WHERE status = 'busy'))::numeric /
            NULLIF(COUNT(*) FILTER (WHERE status <> 'inactive'), 0),
            2
          )
        END AS rate
       FROM vehicles`,
    ),
  ]);

  return {
    shipments_per_day: shipDay.rows.map((r) => ({
      date: r.day,
      count: r.count,
    })),
    revenue_per_day: revDay.rows.map((r) => ({
      date: r.day,
      revenue: num(r.revenue),
    })),
    most_active_routes: routes.rows.map((r) => ({
      route_from: r.route_from,
      route_to: r.route_to,
      shipment_count: r.shipment_count,
    })),
    vehicle_utilization_rate: num(utilR.rows[0]?.rate),
  };
}
