import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const runMigration = async () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    // Read the migration file
    const migrationPath = path.resolve(__dirname, '../supabase/migrations/20250708T16501-add-missing-personnel.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Running migration...');
    console.log('Adding 308 personnel records to the database...');
    
    // Extract the INSERT statement from the migration file
    const insertMatch = migrationSQL.match(/INSERT INTO public\.personnel[\s\S]*?;/);
    if (!insertMatch) {
      throw new Error('Could not find INSERT statement in migration file');
    }
    
    const insertSQL = insertMatch[0];
    
    // Execute the migration using raw SQL
    const { data, error } = await supabase.rpc('exec', { sql: insertSQL });
    
    if (error) {
      console.error('Migration failed:', error);
      process.exit(1);
    }
    
    console.log('Migration completed successfully!');
    console.log('Added 308 personnel records to the database.');
    
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  }
};

runMigration();