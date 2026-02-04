import { useQuery } from "@tanstack/react-query";
import {
  shopAPI,
  serviceItemAPI,
  collectionAPI,
  artistAPI,
} from "@/services/api";
import { ServiceItem, ComponentType } from "@/types/database";

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

export const useCustomerArtistById = (artistId: string | undefined) => {
  return useQuery({
    queryKey: ["customer-artist", artistId],
    queryFn: async () => {
      if (!artistId) return null;
      try {
        return await artistAPI.getById(artistId);
      } catch (error: any) {
        console.error("Error fetching artist:", error);
        return null;
      }
    },
    enabled: !!artistId,
  });
};

export const useCustomerServiceItems = (shopId?: string, artistId?: string) => {
  const { data: serviceItems = [], isLoading } = useQuery<ServiceItem[]>({
    queryKey: ["customer-service-items", shopId, artistId],
    queryFn: async () => {
      if (shopId) {
        try {
          return await serviceItemAPI.getByShop(shopId);
        } catch (error: any) {
          console.error("Error fetching shop service items:", error);
          return [];
        }
      } else if (artistId) {
        try {
          return await serviceItemAPI.getByArtist(artistId);
        } catch (error: any) {
          console.error("Error fetching artist service items:", error);
          return [];
        }
      }
      return [];
    },
    enabled: !!shopId || !!artistId,
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

export const useCustomerCollections = (shopId?: string, artistId?: string) => {
  return useQuery({
    queryKey: ["customer-collections", shopId, artistId],
    queryFn: async () => {
      if (shopId) {
        try {
          return await collectionAPI.getByShop(shopId);
        } catch (error: any) {
          console.error("Error fetching shop collections:", error);
          return [];
        }
      } else if (artistId) {
        try {
          return await collectionAPI.getByArtist(artistId);
        } catch (error: any) {
          console.error("Error fetching artist collections:", error);
          return [];
        }
      }
      return [];
    },
    enabled: !!shopId || !!artistId,
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

export const useCustomerArtists = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["customer-artists"],
    queryFn: async () => {
      try {
        return await artistAPI.getAll();
      } catch (error: any) {
        console.error("Error fetching artists:", error);
        return [];
      }
    },
    enabled: options?.enabled ?? true,
  });
};
