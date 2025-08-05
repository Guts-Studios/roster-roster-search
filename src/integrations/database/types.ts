// Database types matching the existing schema
export interface Personnel {
  id: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  badge_number: string | null;
  classification: string | null;
  division: string | null;
  regular_pay: number | null;
  overtime: number | null;
  other_pay: number | null;
  premiums: number | null;
  health_dental_vision: number | null;
  payout: number | null;
}

export interface AppConfig {
  id: string;
  created_at: string;
  updated_at: string;
  key: string;
  value: string;
  description: string | null;
}

// Query result types
export interface PersonnelQueryResult {
  data: Personnel[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

// Database schema types
export interface Database {
  public: {
    Tables: {
      personnel: {
        Row: Personnel;
        Insert: Omit<Personnel, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Personnel, 'id' | 'created_at' | 'updated_at'>> & {
          updated_at?: string;
        };
      };
      app_config: {
        Row: AppConfig;
        Insert: Omit<AppConfig, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<AppConfig, 'id' | 'created_at' | 'updated_at'>> & {
          updated_at?: string;
        };
      };
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];