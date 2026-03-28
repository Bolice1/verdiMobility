-- Supplemental indexes for admin aggregations (idempotent)

CREATE INDEX IF NOT EXISTS idx_shipments_created_status ON shipments (created_at DESC, status);

CREATE INDEX IF NOT EXISTS idx_shipments_route_agg ON shipments (pickup_location, destination);

CREATE INDEX IF NOT EXISTS idx_payments_status_amount ON payments (status, amount);

CREATE INDEX IF NOT EXISTS idx_vehicles_company_status ON vehicles (company_id, status);
