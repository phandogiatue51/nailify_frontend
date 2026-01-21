import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collectionAPI } from "@/services/api";
import { Collection, CollectionItem, ServiceItem } from "@/types/database";
import { useToast } from "./use-toast";

export const useShopOwnerCollections = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  // Shop owners use getByShopAuth() which extracts shopId from JWT
  const { data: collections = [], isLoading } = useQuery({
    queryKey: ["shop-owner-collections"],
    queryFn: async () => {
      try {
        return await collectionAPI.getByShopAuth();
      } catch (error: any) {
        console.error("Error fetching shop owner collections:", error);
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

  const createCollection = useMutation({
    mutationFn: async (formData: FormData) => {
      // Backend extracts shopId from JWT - no need to add shopId
      return await collectionAPI.createCollection(formData);
    },
    onSuccess: (data) => {
      // Update cache immediately
      queryClient.setQueryData(
        ["shop-owner-collections"],
        (old: Collection[] = []) => [...old, data],
      );
      toast({
        description: "Collection created successfully!",
        duration: 3000,
      });
      // Invalidate query to ensure freshness
      queryClient.invalidateQueries({ queryKey: ["shop-owner-collections"] });
      return data;
    },
    onError: (error: any) => {
      console.error("Error creating collection:", error);
      throw error;
    },
  });

  const updateCollection = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      return await collectionAPI.updateCollection(id, formData);
    },
    onSuccess: (updatedCollection) => {
      // Update cache immediately
      queryClient.setQueryData(
        ["shop-owner-collections"],
        (old: Collection[] = []) =>
          old.map((col) =>
            col.id === updatedCollection.id ? updatedCollection : col,
          ),
      );
      toast({
        description: "Collection updated successfully!",
        duration: 3000,
      });
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["shop-owner-collections"] });
      return updatedCollection;
    },
    onError: (error: any) => {
      console.error("Error updating collection:", error);
      throw error;
    },
  });

  const deleteCollection = useMutation({
    mutationFn: async (id: string) => {
      return await collectionAPI.deleteCollection(id);
    },
    onSuccess: (_, collectionId) => {
      // Remove from cache immediately
      queryClient.setQueryData(
        ["shop-owner-collections"],
        (old: Collection[] = []) =>
          old.filter((collection) => collection.id !== collectionId),
      );

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["shop-owner-collections"] });
    },
    onError: (error: any) => {
      console.error("Error deleting collection:", error);
      throw error;
    },
  });

  // Helper to get collection items
  const getCollectionItems = (collectionId: string) => {
    // You might need a separate API endpoint for this
    return [];
  };

  return {
    collections,
    isLoading,
    createCollection,
    updateCollection,
    deleteCollection,
    getCollectionItems,
  };
};

// Hook for a specific collection (shop owner view)
export const useShopOwnerCollectionById = (
  collectionId: string | undefined,
) => {
  return useQuery({
    queryKey: ["shop-owner-collection", collectionId],
    queryFn: async () => {
      if (!collectionId) return null;
      try {
        return await collectionAPI.getById(collectionId);
      } catch (error: any) {
        console.error("Error fetching shop owner collection:", error);
        return null;
      }
    },
    enabled: !!collectionId,
  });
};
