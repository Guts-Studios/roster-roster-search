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

// Function to parse SQL files and get existing badge numbers
const getExistingBadgeNumbersFromSql = (filePath: string): string[] => {
    const sqlFile = fs.readFileSync(filePath, 'utf8');
    const badgeNumbers: string[] = [];
    // Regex to capture the 4th value (badge number) in each INSERT tuple
    const regex = /\(\s*'[^']+'\s*,\s*'[^']+'\s*,\s*'[^']+'\s*,\s*'([^']+)'/g;
    let match;
    while ((match = regex.exec(sqlFile)) !== null) {
        badgeNumbers.push(match[1]);
    }
    return badgeNumbers;
};

// Main function to generate the migration file
const generateMigration = async () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const newPersonnelData = await parseCSV(path.resolve(__dirname, '../public/data/SAPD ROSTER 202403.csv'));
    
    // Get existing badge numbers from all migration files
    const migrationDir = path.resolve(__dirname, '../supabase/migrations');
    const migrationFiles = fs.readdirSync(migrationDir).filter(f => f.endsWith('.sql'));
    
    let existingBadgeNumbers: string[] = [];
    migrationFiles.forEach(file => {
        const filePath = path.join(migrationDir, file);
        const badgesFromFile = getExistingBadgeNumbersFromSql(filePath);
        existingBadgeNumbers.push(...badgesFromFile);
    });
    existingBadgeNumbers = [...new Set(existingBadgeNumbers)]; // Make unique

    const missingPersonnel = newPersonnelData.filter(p => p['Badge #'] && !existingBadgeNumbers.includes(p['Badge #']));

    if (missingPersonnel.length === 0) {
      console.log("No new personnel to add. Database is up to date.");
      return;
    }

    console.log(`Found ${missingPersonnel.length} new personnel to add.`);

    const values = missingPersonnel.map(p => {
      const lastName = p['Last Name'] ? p['Last Name'].replace(/'/g, "''") : '';
      const firstName = p['First Name'] ? p['First Name'].replace(/'/g, "''") : '';
      const classification = p['Classification'] ? p['Classification'].replace(/'/g, "''") : null;
      const badgeNumber = p['Badge #'] ? p['Badge #'].replace(/'/g, "''") : null;
      const division = p['Division'] ? p['Division'].replace(/'/g, "''") : null;
      
      const parseCurrency = (val: string) => val && val !== '-' ? parseFloat(val.replace(/,/g, '')) : null;

      const regularPay = parseCurrency(p['Regular Pay']);
      const premiums = parseCurrency(p['Premiums']);
      const overtime = parseCurrency(p['Overtime']);
      const payout = parseCurrency(p['Payout']);
      const other = parseCurrency(p['Other']);
      const healthDentalVision = parseCurrency(p['Health Dental Vision']);

      const toSql = (val: string | number | null) => val === null || val === undefined ? 'NULL' : (typeof val === 'string' ? `'${val}'` : val);

      return `(${toSql(lastName)}, ${toSql(firstName)}, ${toSql(classification)}, ${toSql(badgeNumber)}, ${toSql(division)}, ${toSql(regularPay)}, ${toSql(premiums)}, ${toSql(overtime)}, ${toSql(payout)}, ${toSql(other)}, ${toSql(healthDentalVision)})`;
    }).join(',\n');

    const migrationContent = `
INSERT INTO public.personnel (
  last_name, first_name, classification, badge_number, division,
  regular_pay, premiums, overtime, payout, other_pay, health_dental_vision
) VALUES
${values};
`;

    const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 14);
    const migrationFileName = `${timestamp}-add-missing-personnel.sql`;
    const migrationFilePath = path.resolve(migrationDir, migrationFileName);

    fs.writeFileSync(migrationFilePath, migrationContent);

    console.log(`Migration file created: ${migrationFileName}`);
  } catch (error) {
    console.error("Error generating migration:", error);
  }
};

generateMigration();