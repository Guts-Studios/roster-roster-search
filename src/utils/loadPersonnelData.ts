// NOTE: This utility file is disabled to prevent frontend database imports
// All database operations should be handled through the backend API

// import { api } from "@/integrations/api/client";

// Sample personnel data to test with (reduced set for now)
const samplePersonnelData = [
  { last_name: 'Wilson', first_name: 'Rashad', classification: 'Police Officer', badge_number: '3023', division: 'Criminal Investigations', regular_pay: 120942.53, premiums: 29631.08, overtime: 205727.08, payout: 10971.56, health_dental_vision: 18108.00 },
  { last_name: 'Capacete', first_name: 'Justo', classification: 'Police Officer', badge_number: '2998', division: 'Crimes Against Persons/Special Investigations', regular_pay: 120942.53, premiums: 41725.38, overtime: 78899.02, payout: 5635.76, health_dental_vision: 18108.00 },
  { last_name: 'Delgadillo', first_name: 'Manuel', classification: 'Police Officer', badge_number: '2322', division: 'Operations Division', regular_pay: 120942.53, premiums: 36282.86, overtime: 119485.95, health_dental_vision: 18108.00 },
  { last_name: 'Gutierrez', first_name: 'Edward', classification: 'Police Officer', badge_number: '2560', division: 'Field Operations', regular_pay: 120942.53, premiums: 41725.38, overtime: 150358.07, payout: 2699.54, health_dental_vision: 18108.00 },
  { last_name: 'Esquivel', first_name: 'Saul', classification: 'Police Officer', badge_number: '3295', division: 'Traffic', regular_pay: 120942.53, premiums: 43390.44, overtime: 89729.33, health_dental_vision: 18108.00 }
];

// These functions are commented out to prevent database imports in frontend
// If you need to load sample data, use the backend scripts instead

/*
export const loadSampleData = async () => {
  try {
    // This would need to be implemented as a backend API endpoint
    console.warn('loadSampleData is disabled - use backend scripts for data loading');
    return { success: false, error: 'Function disabled for frontend/backend separation' };
  } catch (error) {
    console.error('Error loading sample data:', error);
    return { success: false, error };
  }
};

export const checkDataCount = async () => {
  try {
    // This would need to be implemented as a backend API endpoint
    console.warn('checkDataCount is disabled - use backend scripts for data checking');
    return { count: 0, error: 'Function disabled for frontend/backend separation' };
  } catch (error) {
    return { count: 0, error };
  }
};
*/