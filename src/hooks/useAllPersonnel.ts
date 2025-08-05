import { useQuery } from "@tanstack/react-query";
import { api } from "@/integrations/api/client";
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
      // Call the backend API instead of direct DB access
      const requestData = {
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        page: filters.page,
        pageSize: filters.pageSize
      };

      const result = await api.post('/personnel/all', requestData);

      // Client-side sorting for total compensation (if backend doesn't handle it)
      if (filters.sortBy === 'total_compensation') {
        result.data.sort((a: Personnel, b: Personnel) => {
          const aTotal = getTotalCompensation(a);
          const bTotal = getTotalCompensation(b);
          return filters.sortOrder === 'asc' ? aTotal - bTotal : bTotal - aTotal;
        });
      }

      return result;
    },
  });
};