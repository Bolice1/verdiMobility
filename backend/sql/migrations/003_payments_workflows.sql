-- Enterprise payment workflow support

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'payment_status'
      AND n.nspname = 'public'
  ) THEN
    CREATE TYPE payment_status AS ENUM (
      'pending',
      'authorized',
      'processing',
      'completed',
      'failed',
      'cancelled',
      'partially_refunded',
      'refunded'
    );
  END IF;
END $$;

ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'authorized';
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'processing';
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'cancelled';
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'partially_refunded';

ALTER TABLE payments ADD COLUMN IF NOT EXISTS currency CHAR(3) NOT NULL DEFAULT 'USD';
ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'invoice';
ALTER TABLE payments ADD COLUMN IF NOT EXISTS provider TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS external_reference TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS provider_reference TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS refunded_amount NUMERIC(12, 2) NOT NULL DEFAULT 0;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS failure_code TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS failure_message TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS refund_reason TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE payments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

UPDATE payments
SET currency = UPPER(currency),
    updated_at = COALESCE(updated_at, NOW()),
    created_at = COALESCE(created_at, NOW())
WHERE currency IS DISTINCT FROM UPPER(currency)
   OR updated_at IS NULL
   OR created_at IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payments_refunded_amount_nonnegative'
  ) THEN
    ALTER TABLE payments
      ADD CONSTRAINT payments_refunded_amount_nonnegative
      CHECK (refunded_amount >= 0 AND refunded_amount <= amount);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payments_currency_format'
  ) THEN
    ALTER TABLE payments
      ADD CONSTRAINT payments_currency_format
      CHECK (currency ~ '^[A-Z]{3}$');
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_external_reference
  ON payments (external_reference)
  WHERE external_reference IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_provider_reference
  ON payments (provider_reference)
  WHERE provider_reference IS NOT NULL;