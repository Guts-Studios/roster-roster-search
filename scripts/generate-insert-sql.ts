import { createClient } from '@supabase/supabase-js';
import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = "https://jfgksbgcafdvvujopbnm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZ2tzYmdjYWZkdnZ1am9wYm5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3Mzg1NDQsImV4cCI6MjA2NzMxNDU0NH0.20UOkoZ3cMF39tZsK1-8UMp2l1fz0YZ20hfhI5_Yypo";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface PersonnelRecord {
  last_name: string;
  first_name: string;
  classification: string | null;
  badge_number: string;
  division: string | null;
  regular_pay: number | null;
  premiums: number | null;
  overtime: number | null;
  payout: number | null;
  other_pay: number | null;
  health_dental_vision: number | null;
}

async function getExistingPersonnel(): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('personnel')
    .select('badge_number')
    .not('badge_number', 'is', null);

  if (error) {
    console.error('Error fetching existing personnel:', error);
    throw error;
  }

  return new Set(data.map(p => p.badge_number));
}

function parseCSVData(csvPath: string): PersonnelRecord[] {
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const parsed = Papa.parse(csvContent, { header: true, skipEmptyLines: true });
  
  return (parsed.data as Record<string, string>[]).map((row) => ({
    last_name: row['Last Name']?.trim() || '',
    first_name: row['First Name']?.trim() || '',
    classification: row['Classification']?.trim() || null,
    badge_number: row['Badge #']?.trim() || '',
    division: row['Division']?.trim() || null,
    regular_pay: parseFloat(row['Regular Pay']?.replace(/[$,]/g, '') || '0') || null,
    premiums: parseFloat(row['Premiums']?.replace(/[$,]/g, '') || '0') || null,
    overtime: parseFloat(row['Overtime']?.replace(/[$,]/g, '') || '0') || null,
    payout: parseFloat(row['Payout']?.replace(/[$,]/g, '') || '0') || null,
    other_pay: parseFloat(row['Other Pay']?.replace(/[$,]/g, '') || '0') || null,
    health_dental_vision: parseFloat(row['Health/Dental/Vision']?.replace(/[$,]/g, '') || '0') || null,
  })).filter(record => record.badge_number && record.last_name && record.first_name);
}

function formatSQLValue(value: string | number | null): string {
  if (value === null || value === undefined) {
    return 'NULL';
  }
  if (typeof value === 'string') {
    // Escape single quotes by doubling them
    return `'${value.replace(/'/g, "''")}'`;
  }
  return value.toString();
}

function generateInsertSQL(personnel: PersonnelRecord[]): string {
  if (personnel.length === 0) {
    return '-- No new personnel to insert\n';
  }

  let sql = `-- Insert ${personnel.length} new personnel records\n`;
  sql += `INSERT INTO public.personnel (\n`;
  sql += `  last_name, first_name, classification, badge_number, division,\n`;
  sql += `  regular_pay, premiums, overtime, payout, other_pay, health_dental_vision\n`;
  sql += `) VALUES\n`;

  const valueRows = personnel.map((person, index) => {
    const values = [
      formatSQLValue(person.last_name),
      formatSQLValue(person.first_name),
      formatSQLValue(person.classification),
      formatSQLValue(person.badge_number),
      formatSQLValue(person.division),
      formatSQLValue(person.regular_pay),
      formatSQLValue(person.premiums),
      formatSQLValue(person.overtime),
      formatSQLValue(person.payout),
      formatSQLValue(person.other_pay),
      formatSQLValue(person.health_dental_vision)
    ];
    
    const isLast = index === personnel.length - 1;
    return `(${values.join(', ')})${isLast ? ';' : ','}`;
  });

  sql += valueRows.join('\n');
  sql += '\n\n-- Verify the insertion\n';
  sql += `SELECT COUNT(*) as inserted_count FROM personnel WHERE badge_number IN (\n`;
  sql += personnel.map(p => `  '${p.badge_number}'`).join(',\n');
  sql += '\n);\n';

  return sql;
}

async function main() {
  try {
    console.log('Generating SQL insert script for missing personnel...');
    
    // Step 1: Get existing personnel
    console.log('Fetching existing personnel...');
    const existingBadgeNumbers = await getExistingPersonnel();
    console.log(`Found ${existingBadgeNumbers.size} existing personnel records`);

    // Step 2: Parse CSV data
    const csvPath = path.join(process.cwd(), 'public', 'data', 'SAPD ROSTER 202403.csv');
    console.log(`Reading CSV file: ${csvPath}`);
    const csvPersonnel = parseCSVData(csvPath);
    console.log(`Found ${csvPersonnel.length} personnel records in CSV`);

    // Step 3: Filter out existing personnel
    const newPersonnel = csvPersonnel.filter(person => 
      !existingBadgeNumbers.has(person.badge_number)
    );
    console.log(`Found ${newPersonnel.length} new personnel to add`);

    // Step 4: Generate SQL insert script
    const sqlScript = generateInsertSQL(newPersonnel);
    
    // Step 5: Write SQL script to file
    const outputPath = path.join(process.cwd(), 'missing-personnel-insert.sql');
    fs.writeFileSync(outputPath, sqlScript, 'utf-8');
    
    console.log(`\n✅ SQL insert script generated successfully!`);
    console.log(`📁 File saved to: ${outputPath}`);
    console.log(`📊 Records to insert: ${newPersonnel.length}`);
    
    if (newPersonnel.length > 0) {
      console.log('\n📋 Instructions:');
      console.log('1. Open Supabase Dashboard');
      console.log('2. Go to SQL Editor');
      console.log('3. Copy and paste the contents of missing-personnel-insert.sql');
      console.log('4. Run the script');
      console.log('5. Check the verification query result to confirm insertion');
    }

  } catch (error) {
    console.error('❌ Error generating SQL script:', error);
    process.exit(1);
  }
}

main();