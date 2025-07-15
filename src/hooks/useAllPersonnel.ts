import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Personnel, getTotalCompensation } from "@/types";

export interface AllPersonnelFilters {
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

export const useAllPersonnel = (filters: AllPersonnelFilters) => {
  return useQuery({
    queryKey: ["personnel-all", filters],
    queryFn: async (): Promise<PersonnelResponse> => {
      let query = supabase
        .from("personnel")
        .select("*");

      // Get total count for pagination
      const { count } = await supabase
        .from("personnel")
        .select("*", { count: 'exact', head: true });

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