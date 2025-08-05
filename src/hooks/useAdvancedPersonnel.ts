import { useQuery } from "@tanstack/react-query";
import { db } from "@/integrations/database/client";
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
      // Build WHERE conditions and parameters
      const whereConditions: string[] = [];
      const queryParams: any[] = [];
      let paramCount = 0;

      // Apply search filters with smart logic
      if (filters.firstName && filters.lastName && filters.firstName === filters.lastName) {
        // Single name search: use OR logic to search both first and last name fields
        const searchTerm = filters.firstName.trim();
        paramCount++;
        whereConditions.push(`(first_name ILIKE $${paramCount} OR last_name ILIKE $${paramCount})`);
        queryParams.push(`%${searchTerm}%`);
      } else {
        // Full name search: use AND logic for separate first and last names
        if (filters.firstName && filters.firstName.trim()) {
          paramCount++;
          whereConditions.push(`first_name ILIKE $${paramCount}`);
          queryParams.push(`%${filters.firstName}%`);
        }
        
        if (filters.lastName && filters.lastName.trim()) {
          paramCount++;
          whereConditions.push(`last_name ILIKE $${paramCount}`);
          queryParams.push(`%${filters.lastName}%`);
        }
      }
      
      if (filters.badgeNumber && filters.badgeNumber.trim()) {
        paramCount++;
        whereConditions.push(`badge_number ILIKE $${paramCount}`);
        queryParams.push(`%${filters.badgeNumber}%`);
      }

      // Apply division filter
      if (filters.division) {
        paramCount++;
        whereConditions.push(`division = $${paramCount}`);
        queryParams.push(filters.division);
      }

      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

      // Get total count for pagination
      const countQuery = `SELECT COUNT(*) FROM personnel ${whereClause}`;
      const countResult = await db.queryOne(countQuery, queryParams);
      const totalCount = parseInt(countResult.count);

      // Build ORDER BY clause
      let orderByClause = '';
      if (filters.sortBy === 'name') {
        orderByClause = `ORDER BY last_name ${filters.sortOrder === 'asc' ? 'ASC' : 'DESC'}`;
      } else if (filters.sortBy === 'regular_pay') {
        orderByClause = `ORDER BY regular_pay ${filters.sortOrder === 'asc' ? 'ASC' : 'DESC'}`;
      } else if (filters.sortBy === 'overtime') {
        orderByClause = `ORDER BY overtime ${filters.sortOrder === 'asc' ? 'ASC' : 'DESC'}`;
      } else {
        // For total compensation, we'll sort client-side since it's calculated
        orderByClause = `ORDER BY regular_pay ${filters.sortOrder === 'asc' ? 'ASC' : 'DESC'}`;
      }

      // Apply pagination
      const startIndex = (filters.page - 1) * filters.pageSize;
      const paginationClause = `LIMIT ${filters.pageSize} OFFSET ${startIndex}`;

      // Build main query
      const mainQuery = `
        SELECT * FROM personnel
        ${whereClause}
        ${orderByClause}
        ${paginationClause}
      `;

      const personnel = await db.queryMany(mainQuery, queryParams);

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
  
  return queryResult;
};

export const usePersonnelFilterOptions = () => {
  return useQuery({
    queryKey: ["personnel-filter-options"],
    queryFn: async () => {
      const data = await db.queryMany("SELECT DISTINCT division, classification FROM personnel WHERE division IS NOT NULL OR classification IS NOT NULL");

      const divisions = [...new Set(data?.map(p => p.division).filter(Boolean))];
      const classifications = [...new Set(data?.map(p => p.classification).filter(Boolean))];

      return { divisions, classifications };
    },
  });
};