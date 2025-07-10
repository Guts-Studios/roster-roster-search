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
  classification: string;
  badge_number: string;
  division: string;
  regular_pay: number | null;
  premiums: number | null;
  overtime: number | null;
  payout: number | null;
  other_pay: number | null;
  health_dental_vision: number | null;
}

async function temporarilyAllowAnonInserts() {
  console.log('Temporarily allowing anonymous inserts...');
  
  // Create a temporary policy that allows anonymous inserts
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE POLICY "temp_allow_anon_insert" 
      ON public.personnel 
      FOR INSERT 
      TO anon
      WITH CHECK (true);
    `
  });
  
  if (error) {
    console.error('Error creating temporary policy:', error);
    throw error;
  }
  
  console.log('Temporary policy created successfully');
}

async function removeTemporaryPolicy() {
  console.log('Removing temporary policy...');
  
  const { error } = await supabase.rpc('exec_sql', {
    sql: `DROP POLICY IF EXISTS "temp_allow_anon_insert" ON public.personnel;`
  });
  
  if (error) {
    console.error('Error removing temporary policy:', error);
    // Don't throw here, just log the error
  } else {
    console.log('Temporary policy removed successfully');
  }
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
    classification: row['Classification']?.trim() || '',
    badge_number: row['Badge #']?.trim() || '',
    division: row['Division']?.trim() || '',
    regular_pay: parseFloat(row['Regular Pay']?.replace(/[$,]/g, '') || '0') || null,
    premiums: parseFloat(row['Premiums']?.replace(/[$,]/g, '') || '0') || null,
    overtime: parseFloat(row['Overtime']?.replace(/[$,]/g, '') || '0') || null,
    payout: parseFloat(row['Payout']?.replace(/[$,]/g, '') || '0') || null,
    other_pay: parseFloat(row['Other Pay']?.replace(/[$,]/g, '') || '0') || null,
    health_dental_vision: parseFloat(row['Health/Dental/Vision']?.replace(/[$,]/g, '') || '0') || null,
  })).filter(record => record.badge_number && record.last_name && record.first_name);
}

async function insertPersonnelBatch(personnel: PersonnelRecord[], batchNumber: number) {
  console.log(`Inserting batch ${batchNumber} with ${personnel.length} records...`);
  
  const { data, error } = await supabase
    .from('personnel')
    .insert(personnel)
    .select('id');

  if (error) {
    console.error(`Error inserting batch ${batchNumber}:`, error);
    throw error;
  }

  console.log(`Successfully inserted batch ${batchNumber}: ${data.length} records`);
  return data;
}

async function main() {
  try {
    console.log('Starting personnel data insertion with temporary policy...');
    
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

    if (newPersonnel.length === 0) {
      console.log('No new personnel to add. Exiting.');
      return;
    }

    // Step 4: Temporarily allow anonymous inserts
    await temporarilyAllowAnonInserts();

    try {
      // Step 5: Insert personnel in batches
      const batchSize = 50;
      let totalInserted = 0;

      for (let i = 0; i < newPersonnel.length; i += batchSize) {
        const batch = newPersonnel.slice(i, i + batchSize);
        const batchNumber = Math.floor(i / batchSize) + 1;
        
        await insertPersonnelBatch(batch, batchNumber);
        totalInserted += batch.length;
        
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`\n✅ Successfully inserted ${totalInserted} new personnel records!`);
      
    } finally {
      // Step 6: Always remove the temporary policy
      await removeTemporaryPolicy();
    }

  } catch (error) {
    console.error('❌ Error during personnel insertion:', error);
    
    // Try to clean up the temporary policy even if there was an error
    try {
      await removeTemporaryPolicy();
    } catch (cleanupError) {
      console.error('Error during cleanup:', cleanupError);
    }
    
    process.exit(1);
  }
}

main();