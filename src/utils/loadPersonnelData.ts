import { db } from "@/integrations/database/client";

// Sample personnel data to test with (reduced set for now)
const samplePersonnelData = [
  { last_name: 'Wilson', first_name: 'Rashad', classification: 'Police Officer', badge_number: '3023', division: 'Criminal Investigations', regular_pay: 120942.53, premiums: 29631.08, overtime: 205727.08, payout: 10971.56, health_dental_vision: 18108.00 },
  { last_name: 'Capacete', first_name: 'Justo', classification: 'Police Officer', badge_number: '2998', division: 'Crimes Against Persons/Special Investigations', regular_pay: 120942.53, premiums: 41725.38, overtime: 78899.02, payout: 5635.76, health_dental_vision: 18108.00 },
  { last_name: 'Delgadillo', first_name: 'Manuel', classification: 'Police Officer', badge_number: '2322', division: 'Operations Division', regular_pay: 120942.53, premiums: 36282.86, overtime: 119485.95, health_dental_vision: 18108.00 },
  { last_name: 'Gutierrez', first_name: 'Edward', classification: 'Police Officer', badge_number: '2560', division: 'Field Operations', regular_pay: 120942.53, premiums: 41725.38, overtime: 150358.07, payout: 2699.54, health_dental_vision: 18108.00 },
  { last_name: 'Esquivel', first_name: 'Saul', classification: 'Police Officer', badge_number: '3295', division: 'Traffic', regular_pay: 120942.53, premiums: 43390.44, overtime: 89729.33, health_dental_vision: 18108.00 }
];

export const loadSampleData = async () => {
  try {
    // Insert sample data into Railway database
    const placeholders = samplePersonnelData.map((_, index) => {
      const base = index * 11;
      return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8}, $${base + 9}, $${base + 10}, $${base + 11})`;
    }).join(', ');

    const values = samplePersonnelData.flatMap(person => [
      person.last_name,
      person.first_name,
      person.classification,
      person.badge_number,
      person.division,
      person.regular_pay,
      person.premiums,
      person.overtime,
      person.payout || null,
      person.health_dental_vision
    ]);

    const query = `
      INSERT INTO personnel (last_name, first_name, classification, badge_number, division, regular_pay, premiums, overtime, payout, health_dental_vision)
      VALUES ${placeholders}
      RETURNING *
    `;

    const data = await db.queryMany(query, values);
    return { success: true, data };
  } catch (error) {
    console.error('Error loading sample data:', error);
    return { success: false, error };
  }
};

export const checkDataCount = async () => {
  try {
    const result = await db.queryOne<{ count: number }>('SELECT COUNT(*) as count FROM personnel');
    return { count: result?.count || 0, error: null };
  } catch (error) {
    return { count: 0, error };
  }
};