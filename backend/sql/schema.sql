-- verdiMobility PostgreSQL schema
-- Requires: PostgreSQL 14+ (gen_random_uuid)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE user_role AS ENUM ('admin', 'user', 'driver', 'company');

CREATE TYPE shipment_status AS ENUM (
  'pending',
  'matched',
  'in_transit',
  'delivered',
  'cancelled'
);

CREATE TYPE vehicle_status AS ENUM ('available', 'busy', 'maintenance', 'inactive');

CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  company_id UUID NULL,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  email_verification_token VARCHAR(255) NULL,
  password_reset_token_hash VARCHAR(64) NULL,
  password_reset_expires_at TIMESTAMPTZ NULL,
  suspended BOOLEAN NOT NULL DEFAULT FALSE,
  suspended_reason TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_email_format CHECK (email ~* '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$')
);

CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE users
  ADD CONSTRAINT fk_users_company
  FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE SET NULL;

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_users_company_id ON users (company_id);

CREATE INDEX idx_users_email_verification_token ON users (email_verification_token)
  WHERE email_verification_token IS NOT NULL;

CREATE INDEX idx_users_password_reset_hash ON users (password_reset_token_hash)
  WHERE password_reset_token_hash IS NOT NULL;

CREATE INDEX idx_companies_email ON companies (email);

CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  license_number TEXT NOT NULL UNIQUE,
  rating NUMERIC(3, 2) NOT NULL DEFAULT 0.00,
  CONSTRAINT fk_drivers_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT drivers_rating_range CHECK (rating >= 0 AND rating <= 5)
);

CREATE INDEX idx_drivers_license ON drivers (license_number);

CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  driver_id UUID NULL,
  plate_number TEXT NOT NULL UNIQUE,
  capacity NUMERIC(12, 2) NOT NULL,
  status vehicle_status NOT NULL DEFAULT 'available',
  CONSTRAINT fk_vehicles_company FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
  CONSTRAINT fk_vehicles_driver FOREIGN KEY (driver_id) REFERENCES drivers (id) ON DELETE SET NULL,
  CONSTRAINT vehicles_capacity_positive CHECK (capacity > 0)
);

CREATE INDEX idx_vehicles_company ON vehicles (company_id);
CREATE INDEX idx_vehicles_driver ON vehicles (driver_id);
CREATE INDEX idx_vehicles_plate ON vehicles (plate_number);
CREATE INDEX idx_vehicles_status ON vehicles (status);

CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL,
  vehicle_id UUID NULL,
  pickup_location TEXT NOT NULL,
  destination TEXT NOT NULL,
  weight NUMERIC(12, 2) NOT NULL,
  status shipment_status NOT NULL DEFAULT 'pending',
  price NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_shipments_sender FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE RESTRICT,
  CONSTRAINT fk_shipments_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles (id) ON DELETE SET NULL,
  CONSTRAINT shipments_weight_positive CHECK (weight > 0),
  CONSTRAINT shipments_price_nonnegative CHECK (price >= 0)
);

CREATE INDEX idx_shipments_sender ON shipments (sender_id);
CREATE INDEX idx_shipments_vehicle ON shipments (vehicle_id);
CREATE INDEX idx_shipments_status ON shipments (status);
CREATE INDEX idx_shipments_created ON shipments (created_at DESC);

CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL,
  shipment_id UUID NOT NULL,
  rating NUMERIC(2, 1) NOT NULL,
  review TEXT NULL,
  CONSTRAINT fk_ratings_driver FOREIGN KEY (driver_id) REFERENCES drivers (id) ON DELETE CASCADE,
  CONSTRAINT fk_ratings_shipment FOREIGN KEY (shipment_id) REFERENCES shipments (id) ON DELETE CASCADE,
  CONSTRAINT ratings_shipment_unique UNIQUE (shipment_id),
  CONSTRAINT ratings_value CHECK (rating >= 0 AND rating <= 5)
);

CREATE INDEX idx_ratings_driver ON ratings (driver_id);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  CONSTRAINT uni_payments_shipment UNIQUE (shipment_id),
  CONSTRAINT fk_payments_shipment FOREIGN KEY (shipment_id) REFERENCES shipments (id) ON DELETE CASCADE,
  CONSTRAINT payments_amount_positive CHECK (amount > 0)
);

CREATE INDEX idx_payments_shipment ON payments (shipment_id);
CREATE INDEX idx_payments_status ON payments (status);
