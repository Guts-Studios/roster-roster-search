const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Temporary Supabase client for data export
const SUPABASE_URL = "https://jfgksbgcafdvvujopbnm.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZ2tzYmdjYWZkdnZ1am9wYm5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3Mzg1NDQsImV4cCI6MjA2NzMxNDU0NH0.20UOkoZ3cMF39tZsK1-8UMp2l1fz0YZ20hfhI5_Yypo";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function exportSupabaseData() {
  try {
    console.log('🔄 Starting Supabase data export...');

    // Create backup directory
    const backupDir = path.join(process.cwd(), 'backup');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    // Export personnel data
    console.log('📊 Exporting personnel data...');
    const { data: personnelData, error: personnelError } = await supabase
      .from('personnel')
      .select('*')
      .order('last_name', { ascending: true });

    if (personnelError) {
      throw new Error(`Error fetching personnel data: ${personnelError.message}`);
    }

    // Export app_config data
    console.log('⚙️ Exporting app_config data...');
    const { data: configData, error: configError } = await supabase
      .from('app_config')
      .select('*');

    if (configError) {
      throw new Error(`Error fetching app_config data: ${configError.message}`);
    }

    // Save personnel data
    const personnelFile = path.join(backupDir, 'personnel_backup.json');
    fs.writeFileSync(personnelFile, JSON.stringify(personnelData, null, 2));
    console.log(`✅ Personnel data exported: ${personnelData?.length || 0} records -> ${personnelFile}`);

    // Save app_config data
    const configFile = path.join(backupDir, 'app_config_backup.json');
    fs.writeFileSync(configFile, JSON.stringify(configData, null, 2));
    console.log(`✅ App config data exported: ${configData?.length || 0} records -> ${configFile}`);

    // Generate SQL insert statements for Railway
    console.log('🔧 Generating SQL insert statements...');
    
    let sqlStatements = '';
    
    // Create tables SQL
    sqlStatements += `-- Database schema for Railway migration
-- Run this first to create the tables

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS personnel (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    badge_number VARCHAR,
    classification VARCHAR,
    division VARCHAR,
    regular_pay DECIMAL,
    overtime DECIMAL,
    other_pay DECIMAL,
    premiums DECIMAL,
    health_dental_vision DECIMAL,
    payout DECIMAL
);

CREATE TABLE IF NOT EXISTS app_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    key VARCHAR UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT
);

-- Insert personnel data
`;

    if (personnelData && personnelData.length > 0) {
      for (const person of personnelData) {
        const values = [
          person.id ? `'${person.id}'` : 'uuid_generate_v4()',
          person.created_at ? `'${person.created_at}'` : 'NOW()',
          person.updated_at ? `'${person.updated_at}'` : 'NOW()',
          `'${person.first_name.replace(/'/g, "''")}'`,
          `'${person.last_name.replace(/'/g, "''")}'`,
          person.badge_number ? `'${person.badge_number}'` : 'NULL',
          person.classification ? `'${person.classification.replace(/'/g, "''")}'` : 'NULL',
          person.division ? `'${person.division.replace(/'/g, "''")}'` : 'NULL',
          person.regular_pay ? person.regular_pay : 'NULL',
          person.overtime ? person.overtime : 'NULL',
          person.other_pay ? person.other_pay : 'NULL',
          person.premiums ? person.premiums : 'NULL',
          person.health_dental_vision ? person.health_dental_vision : 'NULL',
          person.payout ? person.payout : 'NULL'
        ];
        
        sqlStatements += `INSERT INTO personnel (id, created_at, updated_at, first_name, last_name, badge_number, classification, division, regular_pay, overtime, other_pay, premiums, health_dental_vision, payout) VALUES (${values.join(', ')});\n`;
      }
    }

    sqlStatements += '\n-- Insert app_config data\n';
    
    if (configData && configData.length > 0) {
      for (const config of configData) {
        const values = [
          config.id ? `'${config.id}'` : 'uuid_generate_v4()',
          config.created_at ? `'${config.created_at}'` : 'NOW()',
          config.updated_at ? `'${config.updated_at}'` : 'NOW()',
          `'${config.key.replace(/'/g, "''")}'`,
          `'${config.value.replace(/'/g, "''")}'`,
          config.description ? `'${config.description.replace(/'/g, "''")}'` : 'NULL'
        ];
        
        sqlStatements += `INSERT INTO app_config (id, created_at, updated_at, key, value, description) VALUES (${values.join(', ')});\n`;
      }
    }

    // Save SQL file
    const sqlFile = path.join(backupDir, 'railway_migration.sql');
    fs.writeFileSync(sqlFile, sqlStatements);
    console.log(`✅ SQL migration file generated -> ${sqlFile}`);

    console.log('\n🎉 Data export completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Connect to your Railway PostgreSQL database');
    console.log('2. Run the SQL file to create tables and insert data');
    console.log('3. Update your application to use the new database client');

  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  }
}

exportSupabaseData();