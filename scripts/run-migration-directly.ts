import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = "https://jfgksbgcafdvvujopbnm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZ2tzYmdjYWZkdnZ1am9wYm5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3Mzg1NDQsImV4cCI6MjA2NzMxNDU0NH0.20UOkoZ3cMF39tZsK1-8UMp2l1fz0YZ20hfhI5_Yypo";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

async function insertPersonnelFromMigration() {
  try {
    console.log('Reading migration file...');
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20250708T16501-add-missing-personnel.sql');
    const migrationContent = fs.readFileSync(migrationPath, 'utf-8');
    
    // Parse the INSERT statements from the migration file
    const insertMatch = migrationContent.match(/INSERT INTO public\.personnel \(([\s\S]*?)\) VALUES\s*([\s\S]*);/);
    
    if (!insertMatch) {
      throw new Error('Could not parse INSERT statement from migration file');
    }
    
    const columns = insertMatch[1].replace(/\s+/g, ' ').trim().split(',').map(col => col.trim());
    const valuesSection = insertMatch[2];
    
    // Parse individual value rows
    const valueRows = [];
    const valueMatches = valuesSection.match(/\([^)]+\)/g);
    
    if (!valueMatches) {
      throw new Error('Could not parse VALUES from migration file');
    }
    
    console.log(`Found ${valueMatches.length} personnel records in migration file`);
    
    // Get existing personnel to avoid duplicates
    const existingBadgeNumbers = await getExistingPersonnel();
    console.log(`Found ${existingBadgeNumbers.size} existing personnel records`);
    
    // Parse and filter personnel records
    const newPersonnel: Record<string, any>[] = [];
    
    for (const valueMatch of valueMatches) {
      // Remove parentheses and split by comma, handling quoted strings
      const valueString = valueMatch.slice(1, -1); // Remove outer parentheses
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      let quoteChar = '';
      
      for (let i = 0; i < valueString.length; i++) {
        const char = valueString[i];
        
        if (!inQuotes && (char === "'" || char === '"')) {
          inQuotes = true;
          quoteChar = char;
          current += char;
        } else if (inQuotes && char === quoteChar) {
          // Check if it's an escaped quote
          if (i + 1 < valueString.length && valueString[i + 1] === quoteChar) {
            current += char + char;
            i++; // Skip the next quote
          } else {
            inQuotes = false;
            current += char;
          }
        } else if (!inQuotes && char === ',') {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      
      if (current.trim()) {
        values.push(current.trim());
      }
      
      // Convert values to proper format
      const personnelRecord: Record<string, string | number | null> = {};
      
      for (let i = 0; i < columns.length && i < values.length; i++) {
        const column = columns[i].trim();
        let value: string | number | null = values[i].trim();
        
        // Handle NULL values
        if (value === 'NULL') {
          value = null;
        } else if (value.startsWith("'") && value.endsWith("'")) {
          // Remove quotes and handle escaped quotes
          value = value.slice(1, -1).replace(/''/g, "'");
        } else if (!isNaN(parseFloat(value))) {
          // Convert numeric values
          value = parseFloat(value);
        }
        
        personnelRecord[column] = value;
      }
      
      // Check if this person already exists
      if (personnelRecord.badge_number && typeof personnelRecord.badge_number === 'string' && !existingBadgeNumbers.has(personnelRecord.badge_number)) {
        newPersonnel.push(personnelRecord);
      }
    }
    
    console.log(`Found ${newPersonnel.length} new personnel to add`);
    
    if (newPersonnel.length === 0) {
      console.log('No new personnel to add. All records already exist.');
      return;
    }
    
    // Insert new personnel in batches
    const batchSize = 50;
    let totalInserted = 0;
    
    for (let i = 0; i < newPersonnel.length; i += batchSize) {
      const batch = newPersonnel.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      
      console.log(`Inserting batch ${batchNumber} with ${batch.length} records...`);
      
      const { data, error } = await supabase
        .from('personnel')
        .insert(batch)
        .select('id');
      
      if (error) {
        console.error(`Error inserting batch ${batchNumber}:`, error);
        
        // If it's an RLS error, provide helpful message
        if (error.code === '42501') {
          console.log('\n❌ Row Level Security (RLS) policy is preventing insertion.');
          console.log('The database requires authenticated users for INSERT operations.');
          console.log('Please use the Supabase CLI to run the migration instead:');
          console.log('  npx supabase db push');
          console.log('Or contact an administrator to temporarily adjust RLS policies.');
        }
        
        throw error;
      }
      
      console.log(`✅ Successfully inserted batch ${batchNumber}: ${data.length} records`);
      totalInserted += data.length;
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n🎉 Successfully inserted ${totalInserted} new personnel records!`);
    
  } catch (error) {
    console.error('❌ Error during personnel insertion:', error);
    process.exit(1);
  }
}

insertPersonnelFromMigration();