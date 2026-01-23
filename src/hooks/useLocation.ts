// @/hooks/useLocation.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LocationAPI } from "@/services/api";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { ShopLocation, ShopLocationCreateDto } from "@/types/database";
import { useToast } from "./use-toast";

export const useShopOwnerLocations = () => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ["shop-owner-locations"],
    queryFn: async () => {
      if (!user || user.role !== 1) return [];
      try {
        return await LocationAPI.getByShop();
      } catch (error: any) {
        console.error("Error fetching shop owner locations:", error);
        if (
          error.message?.includes("404") ||
          error.message?.includes("not found")
        ) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!user && user.role === 1,
  });

  const createLocation = useMutation({
    mutationFn: async (dto: ShopLocationCreateDto) => {
      // ✅ MUST return the response
      return await LocationAPI.createLocation(dto);
    },
    onSuccess: (data) => {
      // ✅ Parameter is named `data`
      queryClient.setQueryData(
        ["shop-owner-locations"],
        (old: ShopLocation[] = []) => [...old, data],
      );
      toast({
        description: data.message,
        variant: "success",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["shop-owner-locations"] });
      return data;
    },
    onError: (error: any) => {
      console.error("Error creating location:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  const updateLocation = useMutation({
    mutationFn: async ({
      id,
      dto,
    }: {
      id: string;
      dto: Partial<ShopLocationCreateDto>;
    }) => {
      return await LocationAPI.updateLocation(id, dto);
    },
    onSuccess: (updatedLocation) => {
      // ✅ Parameter is named `updatedLocation`
      queryClient.setQueryData(
        ["shop-owner-locations"],
        (old: ShopLocation[] = []) =>
          old.map((loc) =>
            loc.shopLocationId === updatedLocation.shopLocationId
              ? updatedLocation
              : loc,
          ),
      );
      toast({
        description: updatedLocation.message,
        variant: "success",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["shop-owner-locations"] });
      return updatedLocation;
    },
    onError: (error: any) => {
      console.error("Error updating location:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  const deleteLocation = useMutation({
    mutationFn: async (id: string) => {
      return await LocationAPI.deleteLocation(id);
    },
    onSuccess: (data, locationId) => {
      // ✅ First parameter is `data` (response), second is `locationId`
      queryClient.setQueryData(
        ["shop-owner-locations"],
        (old: ShopLocation[] = []) =>
          old.filter((location) => location.shopLocationId !== locationId),
      );
      toast({
        description: data.message,
        variant: "success",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["shop-owner-locations"] });
    },
    onError: (error: any) => {
      console.error("Error deleting location:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  return {
    locations,
    isLoading,
    createLocation,
    updateLocation,
    deleteLocation,
  };
};

export const useShopOwnerLocationById = (locationId: string | undefined) => {
  return useQuery({
    queryKey: ["shop-owner-location", locationId],
    queryFn: async () => {
      if (!locationId) return null;
      try {
        return await LocationAPI.getById(locationId);
      } catch (error: any) {
        console.error("Error fetching shop owner location:", error);
        return null;
      }
    },
    enabled: !!locationId,
  });
};
