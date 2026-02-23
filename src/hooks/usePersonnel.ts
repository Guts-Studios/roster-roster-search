import { useQuery } from "@tanstack/react-query";
import { api } from "@/integrations/api/client";
import { Personnel } from "@/types";

export const usePersonnel = () => {
  return useQuery({
    queryKey: ["personnel"],
    queryFn: async (): Promise<Personnel[]> => {
      return await api.queryMany<Personnel>('/personnel');
    },
  });
};

export const usePersonnelById = (id: string) => {
  return useQuery({
    queryKey: ["personnel", id],
    queryFn: async (): Promise<Personnel | null> => {
      if (!id) return null;

      try {
        return await api.queryOne<Personnel>(`/personnel/${id}`);
      } catch (error) {
        // 404 means not found — return null so UI shows "Profile Not Found"
        if (error instanceof Error && error.message.includes('Not Found')) {
          return null;
        }
        // Re-throw other errors so React Query surfaces them via the error state
        throw error;
      }
    },
    enabled: !!id,
  });
};

export const usePersonnelSearch = (searchTerm: string) => {
  return useQuery({
    queryKey: ["personnel", "search", searchTerm],
    queryFn: async (): Promise<Personnel[]> => {
      return await api.post('/personnel/search-simple', { searchTerm });
    },
  });
};