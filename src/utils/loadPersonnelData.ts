import { supabase } from "@/integrations/supabase/client";

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
    const { data, error } = await supabase
      .from('personnel')
      .insert(samplePersonnelData);
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error loading sample data:', error);
    return { success: false, error };
  }
};

export const checkDataCount = async () => {
  const { count, error } = await supabase
    .from('personnel')
    .select('*', { count: 'exact', head: true });
  
  return { count, error };
};