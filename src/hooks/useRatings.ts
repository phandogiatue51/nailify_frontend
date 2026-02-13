import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ratingAPI } from "@/services/api";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { RatingCreateDto } from "@/types/database";
import { RatingFilterDto } from "@/types/filter";
import { useToast } from "./use-toast";

export const useShopRating = (shopId: string | undefined) => {
  return useQuery({
    queryKey: ["shop-rating", shopId],
    queryFn: async () => {
      if (!shopId) return null;
      try {
        return await ratingAPI.getByShopId(shopId);
      } catch (error: any) {
        console.error("Error fetching shop rating:", error);
        return null;
      }
    },
    enabled: !!shopId,
  });
};

export const useShopOwnerRating = () => {
  const { user } = useAuthContext();

  const { data: rating, isLoading } = useQuery({
    queryKey: ["shop-owner-rating"],
    queryFn: async () => {
      if (!user || user.role !== 1) return null;
      try {
        return await ratingAPI.getByShopAuth();
      } catch (error: any) {
        console.error("Error fetching shop owner rating:", error);
        if (
          error.message?.includes("404") ||
          error.message?.includes("not found")
        ) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!user && user.role === 1,
  });

  return {
    rating,
    isLoading,
  };
};

export const useShopLocationRating = (locationId: string | undefined) => {
  return useQuery({
    queryKey: ["shop-location-rating", locationId],
    queryFn: async () => {
      if (!locationId) return null;
      try {
        return await ratingAPI.getByLocationId(locationId);
      } catch (error: any) {
        console.error("Error fetching shop location rating:", error);
        return null;
      }
    },
    enabled: !!locationId,
  });
};

export const useShopLocationOwnerRating = () => {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ["shop-location-owner-rating"],
    queryFn: async () => {
      if (!user || (user.role !== 1 && user.role !== 2)) return null;
      try {
        return await ratingAPI.getByLocationAuth();
      } catch (error: any) {
        console.error("Error fetching shop location owner rating:", error);
        return null;
      }
    },
    enabled: !!user && (user.role === 1 || user.role === 2),
  });
};

export const useArtistRating = (artistId: string | undefined) => {
  return useQuery({
    queryKey: ["artist-rating", artistId],
    queryFn: async () => {
      if (!artistId) return null;
      try {
        return await ratingAPI.getByArtistId(artistId);
      } catch (error: any) {
        console.error("Error fetching artist rating:", error);
        return null;
      }
    },
    enabled: !!artistId,
  });
};

export const useArtistOwnerRating = () => {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ["artist-owner-rating"],
    queryFn: async () => {
      if (!user || user.role !== 3) return null;
      try {
        return await ratingAPI.getByArtistAuth();
      } catch (error: any) {
        console.error("Error fetching artist owner rating:", error);
        return null;
      }
    },
    enabled: !!user && user.role === 3,
  });
};

export const useCreateRating = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createRating = useMutation({
    mutationFn: async ({
      bookingId,
      dto,
    }: {
      bookingId: string;
      dto: RatingCreateDto;
    }) => {
      const formData = new FormData();
      formData.append("Rating", dto.rating.toString());
      if (dto.comment) {
        formData.append("Comment", dto.comment);
      }
      return await ratingAPI.createRating(bookingId, formData);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["booking", variables.bookingId],
      });

      queryClient.invalidateQueries({ queryKey: ["shop-owner-rating"] });
      queryClient.invalidateQueries({ queryKey: ["artist-owner-rating"] });
      queryClient.invalidateQueries({
        queryKey: ["shop-location-owner-rating"],
      });

      toast({
        description: data.message || "Đánh giá thành công!",
        variant: "success",
        duration: 3000,
      });
    },
    onError: (error: any) => {
      console.error("Error creating rating:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra khi đánh giá!",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  return createRating;
};

export const useDeleteRating = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteRating = useMutation({
    mutationFn: async (bookingId: string) => {
      return await ratingAPI.deleteRating(bookingId);
    },
    onSuccess: (data, bookingId) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
      queryClient.invalidateQueries({ queryKey: ["shop-owner-rating"] });
      queryClient.invalidateQueries({ queryKey: ["artist-owner-rating"] });
      queryClient.invalidateQueries({
        queryKey: ["shop-location-owner-rating"],
      });

      toast({
        description: data.message || "Xóa đánh giá thành công!",
        variant: "success",
        duration: 3000,
      });
    },
    onError: (error: any) => {
      console.error("Error deleting rating:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra khi xóa đánh giá!",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  return deleteRating;
};

export const useAdminRatingFilter = () => {
  return useMutation({
    mutationFn: async (filter: RatingFilterDto) => {
      return await ratingAPI.filter(filter);
    },
  });
};

export const useRatingStats = () => {
  const { user } = useAuthContext();
  const shopOwnerRating = useShopOwnerRating();
  const artistOwnerRating = useArtistOwnerRating();
  const locationOwnerRating = useShopLocationOwnerRating();

  if (!user) {
    return {
      rating: null,
      isLoading: false,
    };
  }

  // Return based on user role
  switch (user.role) {
    case 1: // Shop owner
      return {
        rating: shopOwnerRating.rating,
        isLoading: shopOwnerRating.isLoading,
        type: "shop" as const,
      };
    case 2: // Shop location manager
      return {
        rating: locationOwnerRating.data,
        isLoading: locationOwnerRating.isLoading,
        type: "location" as const,
      };
    case 3: // Nail artist
      return {
        rating: artistOwnerRating.data,
        isLoading: artistOwnerRating.isLoading,
        type: "artist" as const,
      };
    default:
      return {
        rating: null,
        isLoading: false,
        type: null,
      };
  }
};
