import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serviceItemAPI } from "@/services/api";
import { ServiceItem, ComponentType } from "@/types/database";
import { useToast } from "./use-toast";

export const useShopOwnerServiceItems = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: serviceItems = [], isLoading } = useQuery({
    queryKey: ["shop-owner-service-items"],
    queryFn: async () => {
      try {
        return await serviceItemAPI.getByShopAuth();
      } catch (error: any) {
        console.error("Error fetching shop owner service items:", error);
        if (
          error.message?.includes("404") ||
          error.message?.includes("not found")
        ) {
          return [];
        }
        throw error;
      }
    },
  });

  const createServiceItem = useMutation({
    mutationFn: async (formData: FormData) => {
      return await serviceItemAPI.createServiceItem(formData);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["shop-owner-service-items"],
        (old: ServiceItem[] = []) => [...old, data],
      );

      queryClient.invalidateQueries({ queryKey: ["shop-owner-service-items"] });
      toast({
        description: data.message,
        variant: "success",
        duration: 3000,
      });
      return data;
    },
    onError: (error: any) => {
      console.error("Error creating service item:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  const updateServiceItem = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      return await serviceItemAPI.updateServiceItem(id, formData);
    },
    onSuccess: (updatedItem) => {
      // ✅ Parameter is named `updatedItem`
      queryClient.setQueryData(
        ["shop-owner-service-items"],
        (old: ServiceItem[] = []) =>
          old.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
      );
      toast({
        description: updatedItem.message,
        variant: "success",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["shop-owner-service-items"] });
      return updatedItem;
    },
    onError: (error: any) => {
      console.error("Error updating service item:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  const deleteServiceItem = useMutation({
    mutationFn: async (id: string) => {
      return await serviceItemAPI.deleteServiceItem(id);
    },
    onSuccess: (data, itemId) => {
      // ✅ First parameter is `data` (response), second is `itemId`
      queryClient.setQueryData(
        ["shop-owner-service-items"],
        (old: ServiceItem[] = []) => old.filter((item) => item.id !== itemId),
      );
      toast({
        description: data.message,
        variant: "success",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["shop-owner-service-items"] });
    },
    onError: (error: any) => {
      console.error("Error deleting service item:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  // Group items by component type
  const groupedItems = serviceItems.reduce(
    (acc, item) => {
      if (!acc[item.component_type]) {
        acc[item.component_type] = [];
      }
      acc[item.component_type].push(item);
      return acc;
    },
    {} as Record<ComponentType, ServiceItem[]>,
  );

  return {
    serviceItems,
    groupedItems,
    isLoading,
    createServiceItem,
    updateServiceItem,
    deleteServiceItem,
  };
};

// Hook for a specific service item (shop owner view)
export const useShopOwnerServiceItemById = (itemId: string | undefined) => {
  return useQuery({
    queryKey: ["shop-owner-service-item", itemId],
    queryFn: async () => {
      if (!itemId) return null;
      try {
        return await serviceItemAPI.getById(itemId);
      } catch (error: any) {
        console.error("Error fetching shop owner service item:", error);
        return null;
      }
    },
    enabled: !!itemId,
  });
};
