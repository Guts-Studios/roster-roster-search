-- 2026 Roster Schema Migration
-- Run against Railway PostgreSQL before the data migration script

-- Phase 1: Add new demographic columns
ALTER TABLE personnel ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE personnel ADD COLUMN IF NOT EXISTS ethnicity TEXT;
ALTER TABLE personnel ADD COLUMN IF NOT EXISTS height TEXT;
ALTER TABLE personnel ADD COLUMN IF NOT EXISTS weight INTEGER;
ALTER TABLE personnel ADD COLUMN IF NOT EXISTS year_of_hire INTEGER;

-- Phase 2: Add versioning columns
ALTER TABLE personnel ADD COLUMN IF NOT EXISTS roster_year INTEGER;
ALTER TABLE personnel ADD COLUMN IF NOT EXISTS is_current BOOLEAN DEFAULT true;

-- Phase 3: Backfill existing records as 2024 historical data
UPDATE personnel SET roster_year = 2024, is_current = false WHERE roster_year IS NULL;

-- Phase 4: Drop the existing badge_number UNIQUE constraint
-- Convention: PostgreSQL names inline UNIQUE constraints as tablename_columnname_key
ALTER TABLE personnel DROP CONSTRAINT IF EXISTS personnel_badge_number_key;
DROP INDEX IF EXISTS idx_personnel_badge_number;

-- Phase 5: Create composite unique constraint (same badge can exist in multiple years)
ALTER TABLE personnel ADD CONSTRAINT personnel_badge_roster_unique
  UNIQUE (badge_number, roster_year);

-- Phase 6: Create indexes for efficient filtering
CREATE INDEX IF NOT EXISTS idx_personnel_roster_year ON personnel(roster_year);
CREATE INDEX IF NOT EXISTS idx_personnel_is_current ON personnel(is_current);
