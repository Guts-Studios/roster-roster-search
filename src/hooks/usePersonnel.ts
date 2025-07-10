import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Personnel } from "@/types";

export const usePersonnel = () => {
  return useQuery({
    queryKey: ["personnel"],
    queryFn: async (): Promise<Personnel[]> => {
      const { data, error } = await supabase
        .from("personnel")
        .select("*")
        .order("last_name", { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    },
  });
};

export const usePersonnelById = (id: string) => {
  return useQuery({
    queryKey: ["personnel", id],
    queryFn: async (): Promise<Personnel | null> => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("personnel")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: !!id,
  });
};

export const usePersonnelSearch = (searchTerm: string) => {
  return useQuery({
    queryKey: ["personnel", "search", searchTerm],
    queryFn: async (): Promise<Personnel[]> => {
      if (!searchTerm.trim()) {
        const { data, error } = await supabase
          .from("personnel")
          .select("*")
          .order("last_name", { ascending: true });

        if (error) throw error;
        return data || [];
      }

      const { data, error } = await supabase
        .from("personnel")
        .select("*")
        .or(`last_name.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,badge_number.ilike.%${searchTerm}%`)
        .order("last_name", { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    },
  });
};