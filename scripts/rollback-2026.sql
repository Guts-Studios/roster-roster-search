-- Rollback 2026 Roster Migration
-- Reverses migrate-2026-schema.sql and deletes 2026 data
-- Run against Railway PostgreSQL to restore pre-migration state

BEGIN;

-- Step 1: Delete all 2026 roster records
DELETE FROM personnel WHERE roster_year = 2026;

-- Step 2: Restore 2024 records as current
UPDATE personnel SET is_current = true WHERE roster_year = 2024;

-- Step 3: Drop the composite unique constraint
ALTER TABLE personnel DROP CONSTRAINT IF EXISTS personnel_badge_roster_unique;

-- Step 4: Drop indexes on versioning columns
DROP INDEX IF EXISTS idx_personnel_roster_year;
DROP INDEX IF EXISTS idx_personnel_is_current;

-- Step 5: Drop new columns (demographics + versioning)
ALTER TABLE personnel DROP COLUMN IF EXISTS gender;
ALTER TABLE personnel DROP COLUMN IF EXISTS ethnicity;
ALTER TABLE personnel DROP COLUMN IF EXISTS height;
ALTER TABLE personnel DROP COLUMN IF EXISTS weight;
ALTER TABLE personnel DROP COLUMN IF EXISTS year_of_hire;
ALTER TABLE personnel DROP COLUMN IF EXISTS roster_year;
ALTER TABLE personnel DROP COLUMN IF EXISTS is_current;

-- Step 6: Restore original badge_number unique constraint
ALTER TABLE personnel ADD CONSTRAINT personnel_badge_number_key UNIQUE (badge_number);

COMMIT;
