import { useQuery } from "@tanstack/react-query";
import { db } from "@/integrations/database/client";
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
      // Get total count for pagination
      const countResult = await db.queryOne<{ count: number }>(
        'SELECT COUNT(*) as count FROM personnel'
      );
      const totalCount = countResult?.count || 0;

      // Build the main query with sorting
      let orderClause = '';
      if (filters.sortBy === 'name') {
        orderClause = `ORDER BY last_name ${filters.sortOrder === 'asc' ? 'ASC' : 'DESC'}`;
      } else if (filters.sortBy === 'regular_pay') {
        orderClause = `ORDER BY regular_pay ${filters.sortOrder === 'asc' ? 'ASC' : 'DESC'}`;
      } else if (filters.sortBy === 'overtime') {
        orderClause = `ORDER BY overtime ${filters.sortOrder === 'asc' ? 'ASC' : 'DESC'}`;
      } else {
        // For total compensation, we'll sort client-side since it's calculated
        orderClause = `ORDER BY regular_pay ${filters.sortOrder === 'asc' ? 'ASC' : 'DESC'}`;
      }

      // Apply pagination
      const startIndex = (filters.page - 1) * filters.pageSize;
      const query = `
        SELECT * FROM personnel
        ${orderClause}
        LIMIT $1 OFFSET $2
      `;

      const personnel = await db.queryMany<Personnel>(
        query,
        [filters.pageSize, startIndex]
      );

      // Client-side sorting for total compensation
      if (filters.sortBy === 'total_compensation') {
        personnel.sort((a, b) => {
          const aTotal = getTotalCompensation(a);
          const bTotal = getTotalCompensation(b);
          return filters.sortOrder === 'asc' ? aTotal - bTotal : bTotal - aTotal;
        });
      }

      const totalPages = Math.ceil(totalCount / filters.pageSize);

      return {
        data: personnel,
        totalCount,
        totalPages,
        currentPage: filters.page,
      };
    },
  });
};