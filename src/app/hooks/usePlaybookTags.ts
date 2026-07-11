import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PlaybookTag {
  id: string;
  domain: string;
  name: string;
  is_active: boolean;
  sort_order: number;
}

export function usePlaybookTags({ includeInactive = false }: { includeInactive?: boolean } = {}) {
  const queryClient = useQueryClient();

  const { data: tags = [], isLoading } = useQuery({
    queryKey: ["playbook-tags", includeInactive],
    queryFn: async () => {
      let query = supabase
        .from("playbook_tags")
        .select("id, domain, name, is_active, sort_order")
        .order("domain", { ascending: true })
        .order("sort_order", { ascending: true });

      if (!includeInactive) {
        query = query.eq("is_active", true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as PlaybookTag[];
    },
  });

  const createTag = useMutation({
    mutationFn: async (tag: { domain: string; name: string; sort_order?: number }) => {
      const { data, error } = await supabase
        .from("playbook_tags")
        .insert(tag)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playbook-tags"] });
      toast.success("Tag created");
    },
    onError: () => toast.error("Failed to create tag"),
  });

  const updateTag = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PlaybookTag> }) => {
      const { data, error } = await supabase
        .from("playbook_tags")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playbook-tags"] });
    },
    onError: () => toast.error("Failed to update tag"),
  });

  const deleteTag = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("playbook_tags").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playbook-tags"] });
      toast.success("Tag deleted");
    },
    onError: () => toast.error("Failed to delete tag"),
  });

  const tagsByDomain = (domain: string) => tags.filter((t) => t.domain === domain);

  return { tags, isLoading, tagsByDomain, createTag, updateTag, deleteTag };
}
