import { createClient } from '@supabase/supabase-js';
import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

interface CsvRow {
  'Last Name': string;
  'First Name': string;
  'Classification': string;
  'Badge #': string;
  'Division': string;
  'Regular Pay': string;
  'Premiums': string;
  'Overtime': string;
  'Payout': string;
  'Other': string;
  'Health Dental Vision': string;
}

// Use the same configuration as the client
const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://jfgksbgcafdvvujopbnm.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZ2tzYmdjYWZkdnZ1am9wYm5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3Mzg1NDQsImV4cCI6MjA2NzMxNDU0NH0.20UOkoZ3cMF39tZsK1-8UMp2l1fz0YZ20hfhI5_Yypo";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to parse CSV and return personnel data
const parseCSV = async (filePath: string): Promise<CsvRow[]> => {
  const csvFile = fs.readFileSync(filePath, 'utf8');
  return new Promise((resolve, reject) => {
    Papa.parse<CsvRow>(csvFile, {
      header: true,
      skipEmptyLines: true,
      transformHeader: header => header.trim(),
      complete: (results) => {
        resolve(results.data.filter(row => row['Last Name'] && row['First Name'])); // Filter out empty rows
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

// Function to get existing badge numbers from database
const getExistingBadgeNumbers = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('personnel')
    .select('badge_number');
  
  if (error) {
    console.error('Error fetching existing personnel:', error);
    return [];
  }
  
  return data.map(p => p.badge_number).filter(Boolean);
};

const insertPersonnel = async () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    console.log('Parsing CSV file...');
    const csvData = await parseCSV(path.resolve(__dirname, '../public/data/SAPD ROSTER 202403.csv'));
    
    console.log('Fetching existing personnel from database...');
    const existingBadgeNumbers = await getExistingBadgeNumbers();
    
    console.log(`Found ${existingBadgeNumbers.length} existing personnel records`);
    console.log(`Found ${csvData.length} personnel records in CSV`);
    
    // Filter out personnel that already exist
    const newPersonnel = csvData.filter(p => p['Badge #'] && !existingBadgeNumbers.includes(p['Badge #']));
    
    if (newPersonnel.length === 0) {
      console.log("No new personnel to add. Database is up to date.");
      return;
    }

    console.log(`Found ${newPersonnel.length} new personnel to add.`);

    // Transform data for insertion
    const personnelToInsert = newPersonnel.map(p => {
      const parseCurrency = (val: string) => val && val !== '-' ? parseFloat(val.replace(/,/g, '')) : null;

      return {
        last_name: p['Last Name'] || null,
        first_name: p['First Name'] || null,
        classification: p['Classification'] || null,
        badge_number: p['Badge #'] || null,
        division: p['Division'] || null,
        regular_pay: parseCurrency(p['Regular Pay']),
        premiums: parseCurrency(p['Premiums']),
        overtime: parseCurrency(p['Overtime']),
        payout: parseCurrency(p['Payout']),
        other_pay: parseCurrency(p['Other']),
        health_dental_vision: parseCurrency(p['Health Dental Vision'])
      };
    });

    console.log('Inserting personnel records...');
    
    // Insert in batches of 100 to avoid timeout
    const batchSize = 100;
    let inserted = 0;
    
    for (let i = 0; i < personnelToInsert.length; i += batchSize) {
      const batch = personnelToInsert.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('personnel')
        .insert(batch);
      
      if (error) {
        console.error(`Error inserting batch ${Math.floor(i/batchSize) + 1}:`, error);
        throw error;
      }
      
      inserted += batch.length;
      console.log(`Inserted ${inserted}/${personnelToInsert.length} records...`);
    }

    console.log(`Successfully inserted ${inserted} new personnel records!`);
    
  } catch (error) {
    console.error('Error inserting personnel:', error);
    process.exit(1);
  }
};

insertPersonnel();