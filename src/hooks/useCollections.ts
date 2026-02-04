import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collectionAPI } from "@/services/api";
import { Collection, CollectionItem, ServiceItem } from "@/types/database";
import { useToast } from "./use-toast";

export const useShopOwnerCollections = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
      // ✅ MUST return the response
      return await collectionAPI.createShopCollection(formData);
    },
    onSuccess: (data) => {
      // ✅ Parameter is named `data`
      queryClient.setQueryData(
        ["shop-owner-collections"],
        (old: Collection[] = []) => [...old, data],
      );
      toast({
        description: data.message || "Tạo bộ sưu tập thành công!", // ✅ Use `data`
        variant: "success",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["shop-owner-collections"] });
      return data;
    },
    onError: (error: any) => {
      console.error("Error creating collection:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });
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
      // ✅ Parameter is named `updatedCollection`
      queryClient.setQueryData(
        ["shop-owner-collections"],
        (old: Collection[] = []) =>
          old.map((col) =>
            col.id === updatedCollection.id ? updatedCollection : col,
          ),
      );
      toast({
        description: updatedCollection.message || "Cập nhật thành công!", // ✅ Use `updatedCollection`
        variant: "success",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["shop-owner-collections"] });
      return updatedCollection;
    },
    onError: (error: any) => {
      console.error("Error updating collection:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  const deleteCollection = useMutation({
    mutationFn: async (id: string) => {
      return await collectionAPI.deleteCollection(id);
    },
    onSuccess: (data, collectionId) => {
      toast({
        description: data.message || "Xóa thành công!",
        variant: "success",
        duration: 3000,
      });
      queryClient.setQueryData(
        ["shop-owner-collections"],
        (old: Collection[] = []) =>
          old.filter((collection) => collection.id !== collectionId),
      );
      queryClient.invalidateQueries({ queryKey: ["shop-owner-collections"] });
    },
    onError: (error: any) => {
      console.error("Error deleting collection:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  const getCollectionItems = (collectionId: string) => {
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
