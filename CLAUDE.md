# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React application for searching and displaying public personnel records. It's a police accountability tool built with Vite, TypeScript, React, shadcn-ui, and Tailwind CSS. The Vercel preview (this repo) is backed by Neon Postgres; the live Railway production deployment uses Railway Postgres — see the Environments section below for the full split.

## Development Commands

- `npm run dev` - Start development server on port 8080
- `npm run build` - Build for production
- `npm run build:dev` - Build for development mode
- `npm run lint` - Run ESLint linting
- `npm run preview` - Preview production build

## Database and Migration Commands

- `npm run generate-migration` - Generate new database migration
- `npm run insert-personnel` - Insert personnel data into Railway database
- `npm run run-migration` - Run migration directly
- `npm run generate-sql` - Generate SQL insert statements
- `npm run db:push` - Push database changes to Railway

## Architecture

### Frontend Structure
- **Pages**: `/src/pages/` - Main route components (Search, ProfileDetails, Statistics, About)
- **Components**: `/src/components/` - Reusable UI components including shadcn-ui components
- **Hooks**: `/src/hooks/` - Custom React hooks for data fetching and state management
- **Types**: `/src/types/index.ts` - TypeScript interfaces, primarily Personnel interface

### Data Layer
- **PostgreSQL Integration**: `/src/integrations/database/` - Postgres client and type definitions. Backend is Neon (preview) or Railway (prod) depending on env; see Environments below.
- **React Query**: Used for data fetching, caching, and state management
- **Personnel Hook**: `usePersonnel`, `usePersonnelById`, `usePersonnelSearch` for data operations
- **Advanced Personnel Hook**: `useAdvancedPersonnel` for filtered and paginated results
- **Stats Hook**: `usePersonnelStats.ts` exports `useTopSalaries`, `usePersonnelAggregates`, `useUniqueValues` — used by the Data Analysis page.

### Key Data Flow
1. Search page uses `useAdvancedPersonnel` hook with filters for pagination and search
2. Personnel data fetched from the configured Postgres `personnel` table using raw SQL queries
3. Search supports name and badge number queries with intelligent detection (numeric = badge, text = name)
4. Results displayed with pagination using `RosterList` and `Pagination` components

### Database Schema
- Primary table: `personnel` with fields for names, badge numbers, pay information, divisions
- `is_current` (boolean): selects the latest record per person across years. One row per unique person on every listing.
- `is_active` (boolean): distinguishes currently-employed officers from departed ones. Set during migration Phase G — true if the person's Phase E union-find group contains a 2026 roster entry. Used by Data Analysis rankings to exclude departed officers' partial-year pay.
- `roster_year` (int): the year the roster record came from (2024 / 2025 / 2026). `payroll_year` (nullable int): the year the pay numbers reflect (may differ from roster_year — e.g., a 2026 roster record can carry 2025 payroll).
- App configuration stored in `app_config` table with secure access patterns
- Personnel photos stored in `/public/photos/` directory with filename conventions
- PostgreSQL database with connection pooling and optimized queries

### Source data files (`public/data/`)

| File | Role |
|---|---|
| `SAPD ROSTER 202403.csv` | Original 2024 roster + payroll. Loaded into the DB as `roster_year=2024`, `payroll_year=2024`. |
| `NSP_2026_SAPD_260114_ROSTER.xlsx` | **January 2026 roster** (current source of truth). Names, badges, demographics, embedded photos. No payroll columns. Loaded as `roster_year=2026`. |
| `NSP_SAPD_2025_PAYROLL - SAPD_2025_PAYROLL.csv` | **Final 2025 payroll** numbers (confirmed by camacho). The migration prefers these for 2026 records' payroll fields and stamps `payroll_year=2025`. |
| `NSP_UPDATE_SAPD_202603 - MASTER.csv` | **Historical / unused.** This was a preliminary 2025 payroll snapshot the city released in March 2026. Superseded by the final 2025 payroll CSV. Kept in the repo for archival reference but NOT consumed by `migrate-2025-2026-data.cjs`. |

### Component Architecture
- Uses shadcn-ui component library with Radix UI primitives
- Tailwind CSS for styling with custom theme colors
- React Router for navigation
- Toast notifications via Sonner

### File Path Conventions
- Components use `@/` alias for `/src/`
- UI components in `/src/components/ui/`
- Custom components in `/src/components/`
- Absolute imports preferred over relative imports

### Build and Deployment
- Vite build system with SWC for fast compilation
- Development server runs on port 8080
- Platform integration for deployment

### Environment variables
- `DATABASE_URL` — Postgres connection string. Local scripts read it via `dotenv` from `.env`. On Vercel, set per environment via the Neon Vercel integration.
- `PASSWORD_SALT` — REQUIRED. Salt for the SHA-256 password hash stored in `app_config.search_password_hash`. The historic default was burned in git history, so `/api/auth/verify` now returns 503 if this is unset.
- `VITE_MISCONDUCT_BASE_URL` — Optional. When set, the profile page shows a "Search Misconduct Records" button (appends `?q=<badge>` for a Pinpoint-style search), and the homepage shows a "Search misconduct and use of force records" link to the bare URL. Inlined at build time by Vite.
- `NODE_ENV` — `production` in prod environments.

## Environments — CRITICAL

There are **two product environments** (preview vs production) and **three DB endpoints**. Confusing them has bitten us before.

| Product env | URL | DB endpoint | Deployed code repo |
|---|---|---|---|
| **Production** (live site) | https://www.nosecretpolice.net | **Railway Postgres** (`crossover.proxy.rlwy.net` / `postgres.railway.internal`) | `Guts-Studios/roster-roster-search` |
| **Preview** (Vercel deployed) | `*-jimmyfncs-projects.vercel.app` | **Neon Postgres — Production branch** (`ep-autumn-pine-aii9iw8c...`) | `jimmyfnc/roster-search-preview` (this repo) |
| **Local dev** (`vercel dev`, scripts run from this repo) | localhost / scripts | **Neon Postgres — Development branch** (`ep-mute-queen-aiverb3d-pooler...`) | this repo |

Yes — the Vercel "Production" *environment* maps to the *Preview* product. Vercel's "Production" just means the main-branch deployment; in our case the main-branch deployment IS the preview. The Neon Vercel integration provisions a separate branch for each Vercel environment (Production / Preview / Development).

### Rule 1: Always verify the DB target before destructive operations

```powershell
node scripts/check-target-db.cjs
```

Prints the host and one of these labels:
- `Neon (preview DEV branch — safe iteration)`
- `Neon (preview PROD branch — affects deployed Vercel preview)`
- `Neon (unknown branch — INVESTIGATE before writing)`
- `Railway (PRODUCTION live site)`

Eyeball the label before running anything that writes.

### Rule 2: Local scripts target the Neon **Development** branch by default

After `vercel env pull` (no flags), `.env` contains the Development branch URL. Migration scripts call `require('dotenv').config()` and pick it up. So:

```powershell
node scripts/migrate-2025-2026-data.cjs           # hits Neon DEV branch
DRY_RUN=1 node scripts/migrate-2025-2026-data.cjs # preview-only; runs in a transaction that always rolls back
```

This is safe for iteration — it does NOT affect what your friend sees on the Vercel preview URL. Use `DRY_RUN=1` (or `--dry-run`) before any real run to confirm the summary matches expectations.

### Rule 3: To affect what the deployed Vercel preview shows, target the Neon **Production** branch explicitly

The deployed Vercel app at `*-jimmyfncs-projects.vercel.app` reads from the Vercel Production env, which is the Neon Production branch. To migrate THAT branch, use the wrapper script:

```powershell
.\scripts\run-against-vercel-prod.ps1 scripts/migrate-2025-2026-data.cjs
.\scripts\run-against-vercel-prod.ps1 scripts/snapshot-state.cjs
.\scripts\run-against-vercel-prod.ps1 scripts/verify-migration.cjs
.\scripts\run-against-vercel-prod.ps1 scripts/run-rollback.cjs
```

The wrapper pulls the Production env vars from Vercel, overrides `DATABASE_URL` inline, runs the requested script, then cleans up.

### Rule 4: Only touch Railway production after preview validation

To migrate the live Railway DB (after the Vercel preview is reviewed and approved):

```powershell
railway run --service Postgres node scripts/migrate-2025-2026-data.cjs
```

`railway run` injects `DATABASE_PUBLIC_URL` from the Railway Postgres service. Confirm the host with `check-target-db.cjs` first — it should label as `Railway (PRODUCTION)`.

**Heuristic**: iterate on Dev Neon → migrate Prod Neon → eyeball the Vercel preview with your friend → only then run against Railway production.

## Smoke Tests

`scripts/smoke-tests.cjs` runs ~41 assertions against the configured DB in roughly 3 seconds. Coverage:

| Section | What it checks |
|---|---|
| 1. DB connectivity + schema | Connection works; all expected columns (`is_active`, `payroll_year`, `rank_title`, etc.) are present |
| 2. Record counts | total / `is_current` / `is_active` / visible / active-visible-current all in expected ranges |
| 3. Migration invariants | latest-per-person, same-badge dedup, `payroll_year`-iff-pay |
| 4. Specific known records | 10 hand-picked cases (Kachirisky promoted, Achutegui's 2025 payroll, Espinoza II merged with Roberto Espinoza, Charles "Charlie" Ruelas display tweak, Bryan G. Cadena Rebollar inherited badge 3932, Armstrong departed, Alan L. Gonzalez payroll-only, Joey Belizario R-prefix, …) |
| 5. Redacted records | Exactly 31 `REDACTED-NNN` exist; 0 leak to public listings |
| 6. Photo coverage | Only the known 9 R-prefix recruits should be without photos |
| 7. YoY data logic | SQL join of 2024/2025 payroll rows: departed officers excluded via `is_active`, Kachirisky shows large positive delta |
| 8. Top earners endpoint logic | Correct `ORDER BY` on `/api/personnel/stats`; top OT > $200k; top total > $250k |
| 9. Breakdowns data logic | SQL aggregation over active/current personnel: ≥5 divisions, ≥3 ranks surfacing |

Sections 7 and 9 are SQL-level data invariants (the original `/yoy-changes` and `/breakdowns` HTTP endpoints were removed when the Data Analysis page was simplified). Section 8 still exercises the live `/api/personnel/stats` endpoint.

### Running the tests

```powershell
# Against your local Dev Neon (whatever .env points at)
npm test

# Against the Vercel Production Neon branch (what the deployed preview reads)
npm run test:prod

# Direct invocations (equivalent)
node scripts/smoke-tests.cjs
.\scripts\run-against-vercel-prod.ps1 scripts/smoke-tests.cjs
```

The script exits non-zero on any failure, so it's CI-friendly.

### Pre-commit hook

`.githooks/pre-commit` runs the smoke tests automatically when any data-layer file is part of the commit (matches `server.js`, the migration scripts, the schema SQL, `xlsx-helper.cjs`, or `smoke-tests.cjs` itself). Pure UI/copy commits skip the tests so the hook stays fast.

**Enable for this clone:**

```powershell
git config core.hooksPath .githooks
```

**Bypass for a single commit** (when you know what you're doing):

```powershell
git commit --no-verify -m "…"
```

The hook is opt-in per-clone so contributors who don't want it can ignore it. Once enabled, any commit that touches data-layer files runs `npm test` and aborts if any assertion fails.