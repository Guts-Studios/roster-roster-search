const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Railway database configuration
const DATABASE_URL = 'DATABASE_URL_PLACEHOLDER';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigration() {
  try {
    console.log('🔄 Starting Railway database migration...');

    // Read the SQL file
    const sqlFile = path.join(process.cwd(), 'backup', 'railway_migration.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');

    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
          await pool.query(statement);
        } catch (error) {
          console.error(`❌ Error executing statement ${i + 1}:`, error.message);
          console.error('Statement:', statement.substring(0, 100) + '...');
          // Continue with other statements for now
        }
      }
    }

    // Test the connection and verify data
    console.log('🔍 Verifying migration...');
    
    const personnelCount = await pool.query('SELECT COUNT(*) FROM personnel');
    const configCount = await pool.query('SELECT COUNT(*) FROM app_config');

    console.log(`✅ Personnel records: ${personnelCount.rows[0].count}`);
    console.log(`✅ App config records: ${configCount.rows[0].count}`);

    console.log('🎉 Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();