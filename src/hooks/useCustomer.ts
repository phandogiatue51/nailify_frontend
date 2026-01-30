import { useQuery } from "@tanstack/react-query";
import { shopAPI, serviceItemAPI, collectionAPI } from "@/services/api";
import { Shop, ServiceItem, Collection, ComponentType } from "@/types/database";

export const useCustomerShops = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["customer-shops"],
    queryFn: async () => {
      try {
        return await shopAPI.getAll();
      } catch (error: any) {
        console.error("Error fetching shops:", error);
        return [];
      }
    },
    enabled: options?.enabled ?? true,
  });
};

export const useCustomerShopById = (shopId: string | undefined) => {
  return useQuery({
    queryKey: ["customer-shop", shopId],
    queryFn: async () => {
      if (!shopId) return null;
      try {
        return await shopAPI.getById(shopId);
      } catch (error: any) {
        console.error("Error fetching shop:", error);
        return null;
      }
    },
    enabled: !!shopId,
  });
};

export const useCustomerServiceItems = (shopId: string | undefined) => {
  const { data: serviceItems = [], isLoading } = useQuery({
    queryKey: ["customer-service-items", shopId],
    queryFn: async () => {
      if (!shopId) return [];
      try {
        return await serviceItemAPI.getByShop(shopId);
      } catch (error: any) {
        console.error("Error fetching customer service items:", error);
        if (
          error.message?.includes("404") ||
          error.message?.includes("not found")
        ) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!shopId,
  });

  const groupedItems = serviceItems.reduce(
    (acc, item) => {
      if (!acc[item.componentType]) {
        acc[item.componentType] = [];
      }
      acc[item.componentType].push(item);
      return acc;
    },
    {} as Record<ComponentType, ServiceItem[]>,
  );

  return {
    serviceItems,
    groupedItems,
    isLoading,
  };
};

export const useCustomerCollections = (shopId: string | undefined) => {
  return useQuery({
    queryKey: ["customer-collections", shopId],
    queryFn: async () => {
      if (!shopId) return [];
      try {
        return await collectionAPI.getByShop(shopId);
      } catch (error: any) {
        console.error("Error fetching customer collections:", error);
        if (
          error.message?.includes("404") ||
          error.message?.includes("not found")
        ) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!shopId,
  });
};

export const useCustomerServiceItemById = (itemId: string | undefined) => {
  return useQuery({
    queryKey: ["customer-service-item", itemId],
    queryFn: async () => {
      if (!itemId) return null;
      try {
        return await serviceItemAPI.getById(itemId);
      } catch (error: any) {
        console.error("Error fetching customer service item:", error);
        return null;
      }
    },
    enabled: !!itemId,
  });
};

export const useCustomerCollectionById = (collectionId: string | undefined) => {
  return useQuery({
    queryKey: ["customer-collection", collectionId],
    queryFn: async () => {
      if (!collectionId) return null;
      try {
        return await collectionAPI.getById(collectionId);
      } catch (error: any) {
        console.error("Error fetching customer collection:", error);
        return null;
      }
    },
    enabled: !!collectionId,
  });
};

export const useAllCustomerServiceItems = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["all-customer-service-items"],
    queryFn: async () => {
      try {
        return await serviceItemAPI.getAll();
      } catch (error: any) {
        console.error("Error fetching all service items:", error);
        return [];
      }
    },
    enabled: options?.enabled ?? true,
  });
};

export const useAllCustomerCollections = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["all-customer-collections"],
    queryFn: async () => {
      try {
        return await collectionAPI.getAll();
      } catch (error: any) {
        console.error("Error fetching all collections:", error);
        return [];
      }
    },
    enabled: options?.enabled ?? true,
  });
};
