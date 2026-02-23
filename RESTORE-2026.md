# Restoring the 2026 Roster Migration

This document explains how to deploy the 2026 roster update once the client has approved the data.

Everything needed is preserved on the `2026-roster-migration` branch.

## Prerequisites

- Access to the Railway PostgreSQL database (connection string in `.env`)
- Node.js installed locally
- Git access to this repository

## Step-by-Step Restoration

### 1. Merge the branch into main

```bash
git checkout main
git merge 2026-roster-migration
git push origin main
```

If there have been other commits on `main` since the rollback, resolve any merge conflicts.

### 2. Run the schema migration

This adds the new columns (`gender`, `ethnicity`, `height`, `weight`, `year_of_hire`, `roster_year`, `is_current`) and updates the unique constraint.

```bash
# Connect to Railway PostgreSQL and run the SQL
# Option A: Using psql (if installed)
psql "$DATABASE_URL" -f scripts/migrate-2026-schema.sql

# Option B: Using Railway CLI
railway run psql -f scripts/migrate-2026-schema.sql

# Option C: Copy/paste the contents of scripts/migrate-2026-schema.sql
# into the Railway database console (railway.app > your service > Data tab)
```

### 3. Run the data migration

This inserts 350 new personnel records for 2026 and marks the 318 existing records as historical (2024).

```bash
npm install papaparse   # if not already installed
node scripts/migrate-2026-roster.cjs
```

You should see output like:
```
Parsed 350 rows from CSV
Loaded 318 existing records for payroll lookup
=== Migration Summary ===
CSV rows inserted: 350
Overlapping (payroll from 2024): ~253
New personnel: ~68
```

### 4. Verify the database

```sql
SELECT roster_year, is_current, COUNT(*)
FROM personnel
GROUP BY roster_year, is_current
ORDER BY roster_year;
```

Expected result:
| roster_year | is_current | count |
|-------------|------------|-------|
| 2024        | false      | 318   |
| 2026        | true       | 350   |

### 5. Deploy to Railway

Push to `main` (if not already done in step 1) and approve the deployment in Railway dashboard if auto-deploy is disabled.

### 6. Verify the live site

- Homepage should show 350 personnel (not 668)
- Search should only return current (2026) roster entries
- Profile pages should display the new "Personal Details" section (gender, ethnicity, etc.)
- Disclaimers should read: "Roster data current as of 2026. Payroll data current as of 2024."

## What Changed in This Migration

### Database
- 7 new columns on `personnel` table
- `roster_year` + `is_current` for historical versioning
- Composite unique constraint on `(badge_number, roster_year)`
- 350 new records (2026, is_current=true)
- 318 existing records become historical (2024, is_current=false)

### Backend (server.js)
- All API queries filter by `WHERE is_current = true`
- Parameterized LIMIT/OFFSET to prevent SQL injection
- Removed duplicate route
- Rate-limited and clamped pagination params

### Frontend
- Profile pages show Personal Details section (gender, ethnicity, height, weight, year of hire)
- Number formatting with proper comma separators
- Dynamic disclaimer years based on `roster_year`
- Consistent card heights
- Fixed heading hierarchy for accessibility

### New Files
- `scripts/migrate-2026-schema.sql` - Schema migration SQL
- `scripts/migrate-2026-roster.cjs` - Data migration script
- `scripts/rollback-2026.sql` - Rollback script (if you ever need to undo again)
- 69 new personnel photos in `public/photos/`
- CSV source data in `public/data/`

## Rollback (if needed again)

If you need to roll back after restoring:

```bash
node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
// Run scripts/rollback-2026.sql contents via node
"
```

Or run `scripts/rollback-2026.sql` directly against the database, then reset `main` to the pre-migration commit.
