import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collectionAPI } from "@/services/api";
import { Collection } from "@/types/database";
import { useToast } from "./use-toast";

export const useNailArtistCollections = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: collections = [], isLoading } = useQuery({
    queryKey: ["artist-collections"],
    queryFn: async () => {
      try {
        return await collectionAPI.getByArtistAuth();
      } catch (error: any) {
        console.error("Error fetching artist collections:", error);
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
      return await collectionAPI.createArtistCollection(formData);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["artist-collections"],
        (old: Collection[] = []) => [...old, data],
      );
      toast({
        description: data.message || "Tạo bộ sưu tập thành công!",
        variant: "success",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["artist-collections"] });
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

  // Reuse the same update and delete mutations since endpoints are the same
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
      queryClient.setQueryData(
        ["artist-collections"],
        (old: Collection[] = []) =>
          old.map((col) =>
            col.id === updatedCollection.id ? updatedCollection : col,
          ),
      );
      toast({
        description: updatedCollection.message || "Cập nhật thành công!",
        variant: "success",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["artist-collections"] });
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
      // ✅ Update cache FIRST
      queryClient.setQueryData(
        ["artist-collections"],
        (old: Collection[] = []) =>
          old.filter((collection) => collection.id !== collectionId),
      );

      // ✅ Then invalidate
      queryClient.invalidateQueries({ queryKey: ["artist-collections"] });

      // ✅ Then show toast
      toast({
        description: data.message || "Xóa thành công!",
        variant: "success",
        duration: 3000,
      });
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

  return {
    collections,
    isLoading,
    createCollection,
    updateCollection,
    deleteCollection,
  };
};

export const useNailArtistCollectionById = (
  collectionId: string | undefined,
) => {
  return useQuery({
    queryKey: ["artist-collection", collectionId],
    queryFn: async () => {
      if (!collectionId) return null;
      try {
        return await collectionAPI.getById(collectionId);
      } catch (error: any) {
        console.error("Error fetching artist collection:", error);
        return null;
      }
    },
    enabled: !!collectionId,
  });
};
