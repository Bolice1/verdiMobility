ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS current_latitude NUMERIC(9, 6);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS current_longitude NUMERIC(9, 6);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS current_location_label TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS available_cargo_space NUMERIC(12, 2);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS last_location_updated_at TIMESTAMPTZ;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'vehicles_latitude_range'
  ) THEN
    ALTER TABLE vehicles
      ADD CONSTRAINT vehicles_latitude_range
      CHECK (current_latitude IS NULL OR (current_latitude >= -90 AND current_latitude <= 90));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'vehicles_longitude_range'
  ) THEN
    ALTER TABLE vehicles
      ADD CONSTRAINT vehicles_longitude_range
      CHECK (current_longitude IS NULL OR (current_longitude >= -180 AND current_longitude <= 180));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'vehicles_available_cargo_space_nonnegative'
  ) THEN
    ALTER TABLE vehicles
      ADD CONSTRAINT vehicles_available_cargo_space_nonnegative
      CHECK (available_cargo_space IS NULL OR available_cargo_space >= 0);
  END IF;
END $$;

UPDATE vehicles
SET available_cargo_space = capacity
WHERE available_cargo_space IS NULL;
