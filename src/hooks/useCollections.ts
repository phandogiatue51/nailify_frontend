import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collectionAPI } from "@/services/api";
import { Collection, CollectionItem, ServiceItem } from "@/types/database";

export const useCollections = (shopId: string | undefined) => {
  const queryClient = useQueryClient();

  const { data: collections = [], isLoading } = useQuery({
    queryKey: ["collections", shopId],
    queryFn: async () => {
      if (!shopId) return [];
      try {
        // Fetch collections for the shop
        return await collectionAPI.getByShop(shopId);
      } catch (error: any) {
        console.error('Error fetching collections:', error);
        // Return empty array for 404 (no collections yet)
        if (error.message?.includes('404') || error.message?.includes('not found')) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!shopId,
  });

  const createCollection = useMutation({
    mutationFn: async ({
      collection,
      itemIds,
    }: {
      collection: Omit<
        Collection,
        | "id"
        | "created_at"
        | "updated_at"
        | "is_active"
        | "items"
        | "total_price"
        | "shop_id"
      >;
      itemIds: string[];
    }) => {
      if (!shopId) throw new Error('Shop ID is required');

      const formData = new FormData();

      formData.append('name', collection.name);
      formData.append('description', collection.description || '');
      formData.append('shopId', shopId);
      formData.append('estimatedDuration', String(collection.estimatedDuration));
      // Add items as JSON array
      if (itemIds.length > 0) {
        formData.append('serviceItemIds', JSON.stringify(itemIds));
      }

      return await collectionAPI.createShop(formData);
    },
    onSuccess: (data) => {
      // Invalidate collections for this shop
      queryClient.invalidateQueries({ queryKey: ["collections", shopId] });
      return data;
    },
    onError: (error: any) => {
      console.error('Error creating collection:', error);
      throw error;
    },
  });

  const updateCollection = useMutation({
    mutationFn: async ({
      id,
      collection,
      itemIds,
    }: {
      id: string;
      collection: Partial<Collection>;
      itemIds?: string[];
    }) => {
      // Create FormData for the update
      const formData = new FormData();

      // Add collection fields
      if (collection.name) formData.append('name', collection.name);
      if (collection.description !== undefined) formData.append('description', collection.description);

      // Add items if provided
      if (itemIds !== undefined) {
        formData.append('serviceItemIds', JSON.stringify(itemIds));
      }

      return await collectionAPI.updateShop(id, formData);
    },
    onSuccess: (updatedCollection) => {
      // Update cache for specific collection
      queryClient.setQueryData(['collections', shopId], (old: Collection[] = []) =>
        old.map(col => col.id === updatedCollection.id ? updatedCollection : col)
      );

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["collections", shopId] });
      return updatedCollection;
    },
    onError: (error: any) => {
      console.error('Error updating collection:', error);
      throw error;
    },
  });

  const deleteCollection = useMutation({
    mutationFn: async (id: string) => {
      // Soft delete - update is_active to false
      const formData = new FormData();
      formData.append('isActive', 'false');

      return await collectionAPI.updateShop(id, formData);
    },
    onSuccess: (_, collectionId) => {
      // Remove from collections list
      queryClient.setQueryData(['collections', shopId], (old: Collection[] = []) =>
        old.filter(collection => collection.id !== collectionId)
      );

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["collections", shopId] });
    },
    onError: (error: any) => {
      console.error('Error deleting collection:', error);
      throw error;
    },
  });

  // Helper to get collection items (if your API doesn't return items with collection)
  const getCollectionItems = (collectionId: string) => {
    // You might need a separate API endpoint for this
    // For now, returning empty array
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

// Hook for a specific collection
export const useCollectionById = (collectionId: string | undefined) => {
  return useQuery({
    queryKey: ["collection", collectionId],
    queryFn: async () => {
      if (!collectionId) return null;
      try {
        return await collectionAPI.getById(collectionId);
      } catch (error: any) {
        console.error('Error fetching collection:', error);
        return null;
      }
    },
    enabled: !!collectionId,
  });
};

// Hook for all collections (admin or public view)
export const useAllCollections = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["all-collections"],
    queryFn: async () => {
      try {
        return await collectionAPI.getAll();
      } catch (error: any) {
        console.error('Error fetching all collections:', error);
        return [];
      }
    },
    enabled: options?.enabled ?? true,
  });
};

// Helper function to create FormData for collection operations
export const createCollectionFormData = (data: {
  name: string;
  description?: string;
  shopId: string;
  serviceItemIds?: string[];
  image?: File;
  estimatedDuration: number;
}) => {
  const formData = new FormData();

  // Add required fields
  formData.append('name', data.name);
  formData.append('shopId', data.shopId);
  formData.append('estimatedDuration', String(data.estimatedDuration));

  // Add optional fields
  if (data.description) formData.append('description', data.description);
  if (data.serviceItemIds && data.serviceItemIds.length > 0) {
    formData.append('serviceItemIds', JSON.stringify(data.serviceItemIds));
  }

  // Add image if provided
  if (data.image) {
    formData.append('image', data.image);
  }

  return formData;
};