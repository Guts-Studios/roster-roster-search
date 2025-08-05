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
        // Handle 404 or other errors
        return null;
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