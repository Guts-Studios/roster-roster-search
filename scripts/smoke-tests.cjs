// Comprehensive smoke tests. Runs assertions against the configured DB
// (Prod Neon when invoked via run-against-vercel-prod.ps1, Dev Neon when
// invoked directly with `node`).
//
// Assertions cover:
//   - DB connectivity + schema integrity
//   - Migration invariants (latest-per-person, payroll_year-iff-pay, dedup)
//   - Specific known records (Kachirisky, Achutegui, Armstrong, Espinoza, ...)
//   - Active/inactive distribution
//   - Photo lookup gaps match the known 9 R-prefix recruits
//   - API-endpoint-shape simulations (yoy-changes, breakdowns, top-salaries)
//
// Exit code: 0 if all green, 1 if any failure.
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const url = process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL;
if (!url) { console.error('No DATABASE_URL'); process.exit(1); }
const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });

let passed = 0;
let failed = 0;
const failures = [];
function assert(name, condition, detail = '') {
  if (condition) {
    console.log('  ✓ ' + name);
    passed++;
  } else {
    console.log('  ✗ ' + name + (detail ? ' — ' + detail : ''));
    failed++;
    failures.push(name + (detail ? ': ' + detail : ''));
  }
}
function header(label) { console.log('\n[' + label + ']'); }

// ---------- Canonical-name helpers (mirror server.js / migration) ----------
const NICK = { dan: 'daniel', danny: 'daniel', mike: 'michael', michael: 'michael', daniel: 'daniel', charlie: 'charles', charles: 'charles', jim: 'james', jimmy: 'james', james: 'james' };
const NSUF = /\s+(jr\.?|junior|sr\.?|senior|i{1,3}|iv|2nd|3rd|4th)$/i;
const norm = s => (s || '').trim().toLowerCase().replace(/\s+/g, ' ');
const stripSuf = s => norm(s).replace(NSUF, '');
const canonKey = (l, f) => {
  const ln = stripSuf(l);
  let fn = stripSuf(f).replace(/\s+[a-z]\.?$/i, '');
  if (NICK[fn]) fn = NICK[fn];
  return ln + '|' + fn;
};
const sumComp = r => Number(r.regular_pay || 0) + Number(r.premiums || 0) +
                     Number(r.overtime || 0) + Number(r.payout || 0) +
                     Number(r.other_pay || 0) + Number(r.health_dental_vision || 0);

(async () => {
  console.log('=== SMOKE TESTS ===');
  console.log('DB host: ' + ((url.split('@')[1] || '').split('/')[0]));

  // ---------- 1) Connectivity + schema ----------
  header('1. DB CONNECTIVITY + SCHEMA');
  try {
    const ping = await pool.query('SELECT 1 AS ok');
    assert('Can connect and query', ping.rows[0].ok === 1);
  } catch (e) {
    assert('Can connect and query', false, e.message);
    await pool.end();
    process.exit(1);
  }
  const cols = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name='personnel'");
  const colNames = cols.rows.map(r => r.column_name);
  for (const required of ['id', 'first_name', 'last_name', 'badge_number', 'roster_year', 'is_current', 'is_active', 'payroll_year', 'rank_title']) {
    assert("personnel column '" + required + "' present", colNames.includes(required));
  }

  // ---------- 2) Counts + distribution ----------
  header('2. RECORD COUNTS');
  const total = await pool.query('SELECT COUNT(*)::int AS c FROM personnel');
  const cur = await pool.query('SELECT COUNT(*)::int AS c FROM personnel WHERE is_current = true');
  const active = await pool.query('SELECT COUNT(*)::int AS c FROM personnel WHERE is_active = true');
  const visibleCur = await pool.query("SELECT COUNT(*)::int AS c FROM personnel WHERE is_current = true AND last_name NOT LIKE 'XXXX%'");
  const activeVisibleCurrent = await pool.query("SELECT COUNT(*)::int AS c FROM personnel WHERE is_current = true AND is_active = true AND last_name NOT LIKE 'XXXX%'");
  assert('Total rows >= 1000', total.rows[0].c >= 1000, 'got ' + total.rows[0].c);
  assert('is_current=true count in [400, 460]', cur.rows[0].c >= 400 && cur.rows[0].c <= 460, 'got ' + cur.rows[0].c);
  assert('is_active=true count in [800, 950]', active.rows[0].c >= 800 && active.rows[0].c <= 950, 'got ' + active.rows[0].c);
  assert('visible (non-redacted) current count >= 350', visibleCur.rows[0].c >= 350, 'got ' + visibleCur.rows[0].c);
  assert('active+visible+current count in [280, 360] (Data Analysis dataset)', activeVisibleCurrent.rows[0].c >= 280 && activeVisibleCurrent.rows[0].c <= 360, 'got ' + activeVisibleCurrent.rows[0].c);

  // ---------- 3) Migration invariants ----------
  header('3. MIGRATION INVARIANTS');
  const lpV = await pool.query(`
    WITH per_person AS (
      SELECT LOWER(REGEXP_REPLACE(TRIM(last_name), '\\s+', ' ', 'g')) AS ln,
             LOWER(REGEXP_REPLACE(REGEXP_REPLACE(TRIM(first_name), '\\s+[A-Za-z]\\.?$', ''), '\\s+', ' ', 'g')) AS fn,
             MAX(roster_year) AS max_year,
             MAX(roster_year) FILTER (WHERE is_current) AS current_year
      FROM personnel WHERE last_name IS NOT NULL AND last_name NOT LIKE 'XXXX%' GROUP BY ln, fn
    )
    SELECT COUNT(*)::int AS c FROM per_person WHERE current_year IS NOT NULL AND current_year <> max_year
  `);
  assert('latest-per-person invariant violations = 0', lpV.rows[0].c === 0, lpV.rows[0].c + ' violations');

  const badgeDupes = await pool.query(`
    SELECT COUNT(*)::int AS c FROM (
      SELECT badge_number FROM personnel WHERE is_current = true AND badge_number IS NOT NULL
      GROUP BY badge_number HAVING COUNT(*) > 1
    ) d
  `);
  assert('Same-badge is_current duplicates = 0', badgeDupes.rows[0].c === 0, badgeDupes.rows[0].c + ' duplicates');

  const payInv = await pool.query(`
    SELECT COUNT(*)::int AS c FROM personnel WHERE payroll_year IS NOT NULL
      AND regular_pay IS NULL AND premiums IS NULL AND overtime IS NULL
      AND payout IS NULL AND other_pay IS NULL AND health_dental_vision IS NULL
  `);
  assert('payroll_year-without-pay invariant violations = 0', payInv.rows[0].c === 0, payInv.rows[0].c + ' violations');

  // ---------- 4) Specific known records ----------
  header('4. SPECIFIC KNOWN RECORDS');
  const checks = [
    {
      name: 'John Kachirisky (#3150) — promoted to Sergeant, is_active=true',
      sql: "SELECT * FROM personnel WHERE last_name='Kachirisky' AND is_current=true",
      verify: r => r && r.classification === 'Police Sergeant' && r.is_active === true && r.badge_number === '3150',
    },
    {
      name: 'Maira Achutegui (#3678) — 2026 record, has 2025 payroll, is_active=true',
      sql: "SELECT * FROM personnel WHERE last_name='Achutegui' AND is_current=true",
      verify: r => r && r.roster_year === 2026 && r.payroll_year === 2025 && r.is_active === true,
    },
    {
      name: 'Roberto Espinoza II (#3770) — merged from "Roberto Espinoza", payroll 2025',
      sql: "SELECT * FROM personnel WHERE last_name='Espinoza II' AND first_name='Roberto' AND is_current=true",
      verify: r => r && r.badge_number === '3770' && r.payroll_year === 2025 && r.is_active === true,
    },
    {
      name: 'Jorge Castro Jr. (#3942) — survived merge, is_active=true',
      sql: "SELECT * FROM personnel WHERE last_name='Castro Jr.' AND first_name='Jorge' AND is_current=true",
      verify: r => r && r.badge_number === '3942' && r.is_active === true,
    },
    {
      name: 'Daniel Serna (#3201) — merged with Danny, is_active=true',
      sql: "SELECT * FROM personnel WHERE last_name='Serna' AND first_name='Daniel' AND is_current=true",
      verify: r => r && r.badge_number === '3201' && r.is_active === true,
    },
    {
      name: 'Charles "Charlie" Ruelas — display name updated, is_active=false (no 2026 record)',
      sql: `SELECT * FROM personnel WHERE last_name='Ruelas' AND first_name='Charles "Charlie"' AND is_current=true`,
      verify: r => r && r.badge_number === '3824' && r.is_active === false,
    },
    {
      name: 'Bryan G. Cadena Rebollar — inherited badge 3932 from 2024',
      sql: "SELECT * FROM personnel WHERE last_name='Cadena Rebollar' AND is_current=true",
      verify: r => r && r.badge_number === '3932',
    },
    {
      name: 'James Armstrong (#3699) — departed, is_active=false',
      sql: "SELECT * FROM personnel WHERE last_name='Armstrong' AND first_name LIKE 'James%' AND is_current=true",
      verify: r => r && r.is_active === false,
    },
    {
      name: 'Alan L. Gonzalez — payroll-only record (no badge, no division)',
      sql: "SELECT * FROM personnel WHERE last_name='Gonzalez' AND first_name='Alan L.' AND is_current=true",
      verify: r => r && r.badge_number === null && (r.division === null || r.division === ''),
    },
    {
      name: 'Joey Belizario (#R415) — R-prefix recruit, is_active=true, no payroll',
      sql: "SELECT * FROM personnel WHERE last_name='Belizario' AND is_current=true",
      verify: r => r && r.badge_number === 'R415' && r.is_active === true && r.payroll_year === null,
    },
  ];
  for (const c of checks) {
    try {
      const r = await pool.query(c.sql);
      assert(c.name, r.rows.length === 1 && c.verify(r.rows[0]),
        r.rows.length === 0 ? 'no rows' : (r.rows.length > 1 ? r.rows.length + ' rows' : 'verification failed: ' + JSON.stringify(r.rows[0])));
    } catch (e) {
      assert(c.name, false, 'query error: ' + e.message);
    }
  }

  // ---------- 5) Redacted records ----------
  header('5. REDACTED RECORDS (REDACTED-NNN)');
  const redacted = await pool.query("SELECT COUNT(*)::int AS c FROM personnel WHERE badge_number LIKE 'REDACTED-%' AND is_current = true");
  assert('Exactly 31 REDACTED-NNN is_current rows', redacted.rows[0].c === 31, 'got ' + redacted.rows[0].c);
  const redactedListing = await pool.query("SELECT COUNT(*)::int AS c FROM personnel WHERE is_current = true AND last_name NOT LIKE 'XXXX%' AND badge_number LIKE 'REDACTED-%'");
  assert('Redacted excluded from public listings (visible filter)', redactedListing.rows[0].c === 0, 'visible rows: ' + redactedListing.rows[0].c);

  // ---------- 6) Photo coverage (R-prefix recruits should be the only missing) ----------
  header('6. PHOTO COVERAGE');
  const photosDir = path.join(__dirname, '..', 'public', 'photos');
  const existingFiles = new Set(fs.readdirSync(photosDir).filter(f => /\.webp$/i.test(f)));
  const visibleCurrentRecords = await pool.query("SELECT first_name, last_name, badge_number FROM personnel WHERE is_current = true AND last_name NOT LIKE 'XXXX%' AND badge_number IS NOT NULL AND badge_number NOT LIKE 'REDACTED-%'");
  const expectedMissing = new Set(['Belizario', 'Cortes', 'Mun', 'Murray', 'O\'Connell', 'Petry', 'Salas', 'Tran', 'Vega']);
  const fmtName = s => s.toLowerCase().replace(/\s+/g, '_').replace(/['"]/g, '');
  let foundCount = 0;
  const trulyMissing = [];
  for (const row of visibleCurrentRecords.rows) {
    // Strip quotes from first_name (handles 'Charles "Charlie"' display tweak).
    const fnRaw = row.first_name.toLowerCase().trim().replace(/["']/g, '').replace(/\s+/g, ' ');
    const lnRaw = row.last_name.toLowerCase().trim();
    const b = row.badge_number;
    const candidates = new Set();
    // First-name variants: as-is, with trailing middle initial stripped, with quoted nickname stripped
    const firstVariants = new Set([fnRaw, fnRaw.replace(/\s+[a-z]\.?$/, '').trim(), fnRaw.split(' ')[0]]);
    // Last-name variants: as-is, suffix-stripped (Jr/Sr/II/...), first word only (compound surnames)
    const baseLn = lnRaw.replace(/\s+(jr\.?|sr\.?|i{1,3}|iv|2nd|3rd|4th)$/i, '').trim();
    const lnParts = baseLn.split(/\s+/);
    const lastVariants = new Set([lnRaw, baseLn, lnParts[0], lnParts[lnParts.length - 1]]);
    for (const fn of firstVariants) {
      if (!fn) continue;
      for (const ln of lastVariants) {
        if (!ln) continue;
        const lnF = fmtName(ln);
        const fnF = fmtName(fn);
        candidates.add(`${lnF}_${fnF}_${b}.webp`);
        candidates.add(`${lnF}_${fnF}_${b.toLowerCase()}.webp`);
        candidates.add(`${lnF}_${fnF}.webp`);
        // Suffix-with-underscore variants when the original had a suffix.
        if (baseLn !== lnRaw) {
          candidates.add(`${lnF}_jr_${fnF}_${b}.webp`);
          candidates.add(`${lnF}jr_${fnF}_${b}.webp`);
          candidates.add(`${lnF}_ii_${fnF}_${b}.webp`);
          candidates.add(`${lnF}ii_${fnF}_${b}.webp`);
        }
        if (ln === 'gonzalez') candidates.add(`gonazalez_${fnF}_${b}.webp`);
      }
    }
    const found = [...candidates].some(c => existingFiles.has(c));
    if (found) foundCount++;
    else trulyMissing.push({ name: row.last_name + ', ' + row.first_name, badge: b });
  }
  assert('All visible records with badges have a photo OR are known R-prefix recruits',
    trulyMissing.every(m => expectedMissing.has(m.name.split(',')[0])),
    trulyMissing.length ? 'unexpected missing: ' + trulyMissing.filter(m => !expectedMissing.has(m.name.split(',')[0])).map(m => m.name + ' #' + m.badge).join('; ') : '');
  assert('Photo lookup found at least 300 photos', foundCount >= 300, 'found ' + foundCount);

  // ---------- 7) YoY endpoint logic ----------
  header('7. YoY ENDPOINT LOGIC');
  const allForYoy = await pool.query(`SELECT * FROM personnel WHERE last_name NOT LIKE 'XXXX%' AND is_active = true`);
  const byPerson = new Map();
  for (const r of allForYoy.rows) {
    const k = canonKey(r.last_name, r.first_name);
    if (!byPerson.has(k)) byPerson.set(k, []);
    byPerson.get(k).push(r);
  }
  let yoyCount = 0;
  let armstrongInYoy = false;
  let kachiriskyDelta = null;
  for (const [, records] of byPerson) {
    const y2024 = records.find(r => r.payroll_year === 2024);
    const y2025 = records.find(r => r.payroll_year === 2025);
    if (!y2024 || !y2025) continue;
    const t24 = sumComp(y2024), t25 = sumComp(y2025);
    if (t24 <= 0 || t25 <= 0) continue;
    yoyCount++;
    const display = records.find(r => r.is_current) || y2025;
    if (display.last_name === 'Armstrong') armstrongInYoy = true;
    if (display.last_name === 'Kachirisky') kachiriskyDelta = t25 - t24;
  }
  assert('YoY result count > 100 (broad sample of active officers)', yoyCount > 100, 'got ' + yoyCount);
  assert('James Armstrong (departed) NOT in YoY results (active filter works)', !armstrongInYoy);
  assert('John Kachirisky shows large increase (promoted to Sergeant)', kachiriskyDelta !== null && kachiriskyDelta > 50000, kachiriskyDelta != null ? '+$' + Math.round(kachiriskyDelta).toLocaleString() : 'not found');

  // ---------- 8) Top earners endpoint logic ----------
  header('8. TOP EARNERS ENDPOINT LOGIC');
  const topOT = await pool.query(`
    SELECT first_name, last_name, badge_number, overtime FROM personnel
    WHERE is_current = true AND last_name NOT LIKE 'XXXX%' AND is_active = true
    ORDER BY overtime DESC NULLS LAST LIMIT 10
  `);
  assert('Top 10 by OT all have positive overtime', topOT.rows.every(r => Number(r.overtime || 0) > 0));
  assert('Top OT earner > $200k', Number(topOT.rows[0].overtime) > 200000, '$' + Number(topOT.rows[0].overtime || 0).toLocaleString());

  const topTotal = await pool.query(`
    SELECT first_name, last_name, badge_number,
      (COALESCE(regular_pay,0)+COALESCE(premiums,0)+COALESCE(overtime,0)+COALESCE(payout,0)+COALESCE(other_pay,0)+COALESCE(health_dental_vision,0)) AS total
    FROM personnel WHERE is_current = true AND last_name NOT LIKE 'XXXX%' AND is_active = true
    ORDER BY total DESC LIMIT 10
  `);
  assert('Top 10 by Total are all positive', topTotal.rows.every(r => Number(r.total) > 0));
  assert('Top total earner > $250k', Number(topTotal.rows[0].total) > 250000, '$' + Number(topTotal.rows[0].total || 0).toLocaleString());

  // ---------- 9) Breakdowns endpoint logic ----------
  header('9. BREAKDOWNS ENDPOINT LOGIC');
  const breakdownPersonnel = await pool.query(`SELECT division, classification, regular_pay, premiums, overtime, payout, other_pay, health_dental_vision FROM personnel WHERE is_current = true AND last_name NOT LIKE 'XXXX%' AND is_active = true`);
  const divs = new Set(breakdownPersonnel.rows.map(r => r.division).filter(Boolean));
  const ranks = new Set(breakdownPersonnel.rows.map(r => r.classification).filter(Boolean));
  assert('At least 5 distinct divisions surfaced', divs.size >= 5, 'got ' + divs.size);
  assert('At least 3 distinct ranks surfaced', ranks.size >= 3, 'got ' + ranks.size);

  // ---------- DONE ----------
  console.log('\n=== RESULTS ===');
  console.log('Passed: ' + passed);
  console.log('Failed: ' + failed);
  if (failed > 0) {
    console.log('\nFailures:');
    for (const f of failures) console.log('  - ' + f);
  }
  await pool.end();
  process.exit(failed === 0 ? 0 : 1);
})().catch(e => {
  console.error('SMOKE TEST CRASH:', e.message);
  pool.end().catch(() => {});
  process.exit(1);
});
