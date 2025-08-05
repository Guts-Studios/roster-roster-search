import { useQuery } from "@tanstack/react-query";
import { db } from "@/integrations/database/client";
import { Personnel, getTotalCompensation } from "@/types";

export interface StatsFilters {
  limit: number;
  division?: string;
  classification?: string;
  sortBy: 'total_compensation' | 'regular_pay' | 'overtime' | 'premiums';
}

export const useTopSalaries = (filters: StatsFilters) => {
  return useQuery({
    queryKey: ["personnel-stats", "top-salaries", filters],
    queryFn: async (): Promise<Personnel[]> => {
      // Build query with filters
      let whereClause = '';
      const params: any[] = [];
      let paramCount = 0;

      if (filters.division) {
        whereClause += `division = $${++paramCount}`;
        params.push(filters.division);
      }
      
      if (filters.classification) {
        if (whereClause) whereClause += ' AND ';
        whereClause += `classification = $${++paramCount}`;
        params.push(filters.classification);
      }
      
      const query = `
        SELECT * FROM personnel
        ${whereClause ? `WHERE ${whereClause}` : ''}
      `;

      const personnel = await db.queryMany<Personnel>(query, params);
      
      // Sort by selected criteria (client-side for calculated fields)
      const sortedData = personnel.sort((a, b) => {
        let aValue = 0;
        let bValue = 0;
        
        switch (filters.sortBy) {
          case 'total_compensation':
            aValue = getTotalCompensation(a);
            bValue = getTotalCompensation(b);
            break;
          case 'regular_pay':
            aValue = a.regular_pay || 0;
            bValue = b.regular_pay || 0;
            break;
          case 'overtime':
            aValue = a.overtime || 0;
            bValue = b.overtime || 0;
            break;
          case 'premiums':
            aValue = a.premiums || 0;
            bValue = b.premiums || 0;
            break;
        }
        
        return bValue - aValue; // Descending order
      });
      
      return sortedData.slice(0, filters.limit);
    },
  });
};

export const usePersonnelAggregates = () => {
  return useQuery({
    queryKey: ["personnel-stats", "aggregates"],
    queryFn: async () => {
      const personnel = await db.queryMany<Personnel>('SELECT * FROM personnel');
      
      // Calculate aggregates
      const totalPersonnel = personnel.length;
      const totalCompensation = personnel.reduce((sum, p) => sum + getTotalCompensation(p), 0);
      const avgCompensation = totalPersonnel > 0 ? totalCompensation / totalPersonnel : 0;
      
      const totalRegularPay = personnel.reduce((sum, p) => sum + (p.regular_pay || 0), 0);
      const totalOvertime = personnel.reduce((sum, p) => sum + (p.overtime || 0), 0);
      const totalPremiums = personnel.reduce((sum, p) => sum + (p.premiums || 0), 0);
      
      // Division breakdown
      const divisionBreakdown = personnel.reduce((acc, p) => {
        const division = p.division || 'Unknown';
        if (!acc[division]) {
          acc[division] = { count: 0, totalCompensation: 0 };
        }
        acc[division].count++;
        acc[division].totalCompensation += getTotalCompensation(p);
        return acc;
      }, {} as Record<string, { count: number; totalCompensation: number }>);
      
      // Classification breakdown
      const classificationBreakdown = personnel.reduce((acc, p) => {
        const classification = p.classification || 'Unknown';
        if (!acc[classification]) {
          acc[classification] = { count: 0, totalCompensation: 0 };
        }
        acc[classification].count++;
        acc[classification].totalCompensation += getTotalCompensation(p);
        return acc;
      }, {} as Record<string, { count: number; totalCompensation: number }>);
      
      return {
        totalPersonnel,
        totalCompensation,
        avgCompensation,
        totalRegularPay,
        totalOvertime,
        totalPremiums,
        divisionBreakdown,
        classificationBreakdown,
      };
    },
  });
};

export const useUniqueValues = () => {
  return useQuery({
    queryKey: ["personnel-stats", "unique-values"],
    queryFn: async () => {
      const data = await db.queryMany<{division: string | null, classification: string | null}>(
        'SELECT DISTINCT division, classification FROM personnel'
      );
      
      const divisions = [...new Set(data.map(p => p.division).filter(Boolean))];
      const classifications = [...new Set(data.map(p => p.classification).filter(Boolean))];
      
      return { divisions, classifications };
    },
  });
};