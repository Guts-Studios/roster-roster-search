import { useQuery } from "@tanstack/react-query";
import { api } from "@/integrations/api/client";
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
  const hasSearchCriteria = !!(filters.firstName || filters.lastName || filters.badgeNumber);
  
  const queryResult = useQuery({
    queryKey: ["personnel-advanced", filters],
    enabled: hasSearchCriteria,
    queryFn: async (): Promise<PersonnelResponse> => {
      // Call the backend API instead of direct DB access
      const searchData = {
        firstName: filters.firstName,
        lastName: filters.lastName,
        badgeNumber: filters.badgeNumber,
        division: filters.division,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        page: filters.page,
        pageSize: filters.pageSize
      };

      const result = await api.post('/personnel/search', searchData);

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
  
  return queryResult;
};

export const usePersonnelFilterOptions = () => {
  return useQuery({
    queryKey: ["personnel-filter-options"],
    queryFn: async () => {
      return await api.queryOne('/personnel-filter-options');
    },
  });
};