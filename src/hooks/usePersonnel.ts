import { useQuery } from "@tanstack/react-query";
import { db } from "@/integrations/database/client";
import { Personnel } from "@/types";

export const usePersonnel = () => {
  return useQuery({
    queryKey: ["personnel"],
    queryFn: async (): Promise<Personnel[]> => {
      const personnel = await db.queryMany<Personnel>(
        'SELECT * FROM personnel ORDER BY last_name ASC'
      );
      return personnel;
    },
  });
};

export const usePersonnelById = (id: string) => {
  return useQuery({
    queryKey: ["personnel", id],
    queryFn: async (): Promise<Personnel | null> => {
      if (!id) return null;
      
      const person = await db.queryOne<Personnel>(
        'SELECT * FROM personnel WHERE id = $1',
        [id]
      );

      return person || null;
    },
    enabled: !!id,
  });
};

export const usePersonnelSearch = (searchTerm: string) => {
  return useQuery({
    queryKey: ["personnel", "search", searchTerm],
    queryFn: async (): Promise<Personnel[]> => {
      if (!searchTerm.trim()) {
        const personnel = await db.queryMany<Personnel>(
          'SELECT * FROM personnel ORDER BY last_name ASC'
        );
        return personnel;
      }

      const searchPattern = `%${searchTerm}%`;
      const personnel = await db.queryMany<Personnel>(
        `SELECT * FROM personnel
         WHERE last_name ILIKE $1
            OR first_name ILIKE $1
            OR badge_number ILIKE $1
         ORDER BY last_name ASC`,
        [searchPattern]
      );

      return personnel;
    },
  });
};