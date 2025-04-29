
export interface Person {
  id: string;
  name: string;
  badgeNumber: string;
  rank?: string;
  department?: string;
  email?: string;
  phone?: string;
  division?: string; // Changed from position to division
  salary?: number; // Added salary field
  hireDate?: string;
  status?: string;
  imageUrl?: string;
}
