import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ServiceItem, ComponentType } from "@/types/database";

export const useServiceItems = (shopId: string | undefined) => {
  const queryClient = useQueryClient();

  const { data: serviceItems, isLoading } = useQuery({
    queryKey: ["service-items", shopId],
    queryFn: async () => {
      if (!shopId) return [];
      const { data, error } = await supabase
        .from("service_items")
        .select("*")
        .eq("shop_id", shopId)
        .eq("is_active", true)
        .order("component_type")
        .order("name");

      if (error) throw error;
      return data as ServiceItem[];
    },
    enabled: !!shopId,
  });

  const createServiceItem = useMutation({
    mutationFn: async (
      item: Omit<ServiceItem, "id" | "created_at" | "updated_at" | "is_active">,
    ) => {
      const { data, error } = await supabase
        .from("service_items")
        .insert(item)
        .select()
        .single();

      if (error) throw error;
      return data as ServiceItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-items", shopId] });
    },
  });

  const updateServiceItem = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<ServiceItem> & { id: string }) => {
      const { data, error } = await supabase
        .from("service_items")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as ServiceItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-items", shopId] });
    },
  });

  const deleteServiceItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("service_items")
        .update({ is_active: false })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-items", shopId] });
    },
  });

  // Group items by component type
  const groupedItems =
    serviceItems?.reduce(
      (acc, item) => {
        if (!acc[item.component_type]) {
          acc[item.component_type] = [];
        }
        acc[item.component_type].push(item);
        return acc;
      },
      {} as Record<ComponentType, ServiceItem[]>,
    ) || {};

  return {
    serviceItems,
    groupedItems,
    isLoading,
    createServiceItem,
    updateServiceItem,
    deleteServiceItem,
  };
};
