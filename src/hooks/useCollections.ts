import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Collection, CollectionItem, ServiceItem } from "@/types/database";

export const useCollections = (shopId: string | undefined) => {
  const queryClient = useQueryClient();

  const { data: collections, isLoading } = useQuery({
    queryKey: ["collections", shopId],
    queryFn: async () => {
      if (!shopId) return [];

      // Fetch collections
      const { data: collectionsData, error: collectionsError } = await supabase
        .from("collections")
        .select("*")
        .eq("shop_id", shopId)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (collectionsError) throw collectionsError;

      // Fetch collection items with service items for each collection
      const collectionsWithItems = await Promise.all(
        (collectionsData as Collection[]).map(async (collection) => {
          const { data: itemsData, error: itemsError } = await supabase
            .from("collection_items")
            .select(
              `
              *,
              service_item:service_items(*)
            `,
            )
            .eq("collection_id", collection.id);

          if (itemsError) throw itemsError;

          const items = (
            itemsData as (CollectionItem & { service_item: ServiceItem })[]
          )
            .map((item) => item.service_item)
            .filter(Boolean);

          const totalPrice = items.reduce(
            (sum, item) => sum + Number(item.price),
            0,
          );

          return {
            ...collection,
            items,
            total_price: totalPrice,
          };
        }),
      );

      return collectionsWithItems;
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
      >;
      itemIds: string[];
    }) => {
      // Create collection
      const { data: newCollection, error: collectionError } = await supabase
        .from("collections")
        .insert(collection)
        .select()
        .single();

      if (collectionError) throw collectionError;

      // Add items to collection
      if (itemIds.length > 0) {
        const { error: itemsError } = await supabase
          .from("collection_items")
          .insert(
            itemIds.map((serviceItemId) => ({
              collection_id: newCollection.id,
              service_item_id: serviceItemId,
            })),
          );

        if (itemsError) throw itemsError;
      }

      return newCollection as Collection;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections", shopId] });
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
      // Update collection
      const { data: updatedCollection, error: collectionError } = await supabase
        .from("collections")
        .update(collection)
        .eq("id", id)
        .select()
        .single();

      if (collectionError) throw collectionError;

      // Update items if provided
      if (itemIds !== undefined) {
        // Delete existing items
        await supabase
          .from("collection_items")
          .delete()
          .eq("collection_id", id);

        // Add new items
        if (itemIds.length > 0) {
          const { error: itemsError } = await supabase
            .from("collection_items")
            .insert(
              itemIds.map((serviceItemId) => ({
                collection_id: id,
                service_item_id: serviceItemId,
              })),
            );

          if (itemsError) throw itemsError;
        }
      }

      return updatedCollection as Collection;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections", shopId] });
    },
  });

  const deleteCollection = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("collections")
        .update({ is_active: false })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections", shopId] });
    },
  });

  return {
    collections,
    isLoading,
    createCollection,
    updateCollection,
    deleteCollection,
  };
};
