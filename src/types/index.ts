
export interface Personnel {
  id: string;
  last_name: string;
  first_name: string;
  classification?: string;
  badge_number?: string;
  division?: string;
  regular_pay?: number;
  premiums?: number;
  overtime?: number;
  payout?: number;
  other_pay?: number;
  health_dental_vision?: number;
  created_at?: string;
  updated_at?: string;
}

// Helper function to get full name
export const getFullName = (person: Personnel): string => {
  return `${person.first_name} ${person.last_name}`;
}

// Helper function to get total compensation
export const getTotalCompensation = (person: Personnel): number => {
  const safeNumber = (value: number | null | undefined): number => {
    return (value && !isNaN(value)) ? value : 0;
  };

  return safeNumber(person.regular_pay) +
         safeNumber(person.premiums) +
         safeNumber(person.overtime) +
         safeNumber(person.payout) +
         safeNumber(person.other_pay) +
         safeNumber(person.health_dental_vision);
}
