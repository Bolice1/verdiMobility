-- Idempotent repair: company_id on users (and FK when possible)

ALTER TABLE users ADD COLUMN IF NOT EXISTS company_id UUID;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_users_company'
  ) THEN
    ALTER TABLE users
      ADD CONSTRAINT fk_users_company
      FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE SET NULL;
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_users_company_id ON users (company_id);
