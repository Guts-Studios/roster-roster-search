import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Personnel, getTotalCompensation } from "@/types";

export interface PersonnelFilters {
  firstName?: string;
  lastName?: string;
  badgeNumber?: string;
  division?: string;
  sortBy: 'name' | 'regular_pay' | 'overtime' | 'total_compensation';
  sortOrder: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

export interface PersonnelResponse {
  data: Personnel[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export const useAdvancedPersonnel = (filters: PersonnelFilters) => {
  return useQuery({
    queryKey: ["personnel-advanced", filters],
    queryFn: async (): Promise<PersonnelResponse> => {
      let query = supabase
        .from("personnel")
        .select("*");

      // Apply individual search filters
      if (filters.firstName && filters.firstName.trim()) {
        query = query.ilike("first_name", `%${filters.firstName}%`);
      }
      
      if (filters.lastName && filters.lastName.trim()) {
        query = query.ilike("last_name", `%${filters.lastName}%`);
      }
      
      if (filters.badgeNumber && filters.badgeNumber.trim()) {
        query = query.ilike("badge_number", `%${filters.badgeNumber}%`);
      }

      // Apply division filter
      if (filters.division) {
        query = query.eq("division", filters.division);
      }

      // Get total count for pagination with simpler approach
      let countQuery = supabase
        .from("personnel")
        .select("*", { count: 'exact', head: true });

      // Apply same filters to count query
      if (filters.firstName && filters.firstName.trim()) {
        countQuery = countQuery.ilike("first_name", `%${filters.firstName}%`);
      }
      
      if (filters.lastName && filters.lastName.trim()) {
        countQuery = countQuery.ilike("last_name", `%${filters.lastName}%`);
      }
      
      if (filters.badgeNumber && filters.badgeNumber.trim()) {
        countQuery = countQuery.ilike("badge_number", `%${filters.badgeNumber}%`);
      }
      
      if (filters.division) {
        countQuery = countQuery.eq("division", filters.division);
      }

      const { count } = await countQuery;

      // Apply sorting (server-side for database fields)
      if (filters.sortBy === 'name') {
        query = query.order('last_name', { ascending: filters.sortOrder === 'asc' });
      } else if (filters.sortBy === 'regular_pay') {
        query = query.order('regular_pay', { ascending: filters.sortOrder === 'asc' });
      } else if (filters.sortBy === 'overtime') {
        query = query.order('overtime', { ascending: filters.sortOrder === 'asc' });
      } else {
        // For total compensation, we'll sort client-side since it's calculated
        query = query.order('regular_pay', { ascending: filters.sortOrder === 'asc' });
      }

      // Apply pagination
      const startIndex = (filters.page - 1) * filters.pageSize;
      query = query.range(startIndex, startIndex + filters.pageSize - 1);

      const { data, error } = await query;

      if (error) throw error;

      const personnel = data || [];

      // Client-side sorting for total compensation
      if (filters.sortBy === 'total_compensation') {
        personnel.sort((a, b) => {
          const aTotal = getTotalCompensation(a);
          const bTotal = getTotalCompensation(b);
          return filters.sortOrder === 'asc' ? aTotal - bTotal : bTotal - aTotal;
        });
      }

      const totalPages = Math.ceil((count || 0) / filters.pageSize);

      return {
        data: personnel,
        totalCount: count || 0,
        totalPages,
        currentPage: filters.page,
      };
    },
  });
};

export const usePersonnelFilterOptions = () => {
  return useQuery({
    queryKey: ["personnel-filter-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("personnel")
        .select("division, classification");

      if (error) throw error;

      const divisions = [...new Set(data?.map(p => p.division).filter(Boolean))];
      const classifications = [...new Set(data?.map(p => p.classification).filter(Boolean))];

      return { divisions, classifications };
    },
  });
};