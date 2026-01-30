// hooks/useNailArtist.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { artistAPI } from "@/services/api";
import { NailArtist } from "@/types/database";
import { useToast } from "./use-toast";

export const useNailArtist = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: myArtist,
    isLoading: artistLoading,
    refetch: refetchMyArtist,
  } = useQuery({
    queryKey: ["my-artist"],
    queryFn: async () => {
      try {
        const data = await artistAPI.getByAuth();
        return data || null; 
      } catch (error: any) {
        if (
          error.message?.includes("404") ||
          error.message?.includes("not found")
        ) {
          return null;
        }
        throw error;
      }
    },
  });

  const createArtist = useMutation({
    mutationFn: async () => {
      return await artistAPI.createArtist();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["my-artist"], data);
      toast({
        description: data.message || "Tạo hồ sơ nail artist thành công!",
        variant: "success",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["my-artist"] });
      return data;
    },
    onError: (error: any) => {
      console.error("Error creating artist profile:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra khi tạo hồ sơ!",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  return {
    myArtist,
    artistLoading,
    createArtist,
    refetchMyArtist,
  };
};
