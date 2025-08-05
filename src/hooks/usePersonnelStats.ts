import { useQuery } from "@tanstack/react-query";
import { api } from "@/integrations/api/client";
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
      const personnel = await api.post('/personnel/stats', {
        type: 'top-salaries',
        filters
      });
      
      // Sort by selected criteria (client-side for calculated fields)
      const sortedData = personnel.sort((a: Personnel, b: Personnel) => {
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
      const personnel = await api.post('/personnel/stats', {
        type: 'aggregates'
      });
      
      // Calculate aggregates client-side
      const totalPersonnel = personnel.length;
      const totalCompensation = personnel.reduce((sum: number, p: Personnel) => sum + getTotalCompensation(p), 0);
      const avgCompensation = totalPersonnel > 0 ? totalCompensation / totalPersonnel : 0;
      
      const totalRegularPay = personnel.reduce((sum: number, p: Personnel) => sum + (p.regular_pay || 0), 0);
      const totalOvertime = personnel.reduce((sum: number, p: Personnel) => sum + (p.overtime || 0), 0);
      const totalPremiums = personnel.reduce((sum: number, p: Personnel) => sum + (p.premiums || 0), 0);
      
      // Division breakdown
      const divisionBreakdown = personnel.reduce((acc: any, p: Personnel) => {
        const division = p.division || 'Unknown';
        if (!acc[division]) {
          acc[division] = { count: 0, totalCompensation: 0 };
        }
        acc[division].count++;
        acc[division].totalCompensation += getTotalCompensation(p);
        return acc;
      }, {} as Record<string, { count: number; totalCompensation: number }>);
      
      // Classification breakdown
      const classificationBreakdown = personnel.reduce((acc: any, p: Personnel) => {
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
      const data = await api.post('/personnel/stats', {
        type: 'unique-values'
      });
      
      const divisions = [...new Set(data.map((p: any) => p.division).filter(Boolean))];
      const classifications = [...new Set(data.map((p: any) => p.classification).filter(Boolean))];
      
      return { divisions, classifications };
    },
  });
};