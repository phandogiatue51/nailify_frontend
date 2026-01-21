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
      return await LocationAPI.createLocation(dto);
    },
    onSuccess: (data) => {
      // Update cache immediately
      queryClient.setQueryData(
        ["shop-owner-locations"],
        (old: ShopLocation[] = []) => [...old, data],
      );
      toast({
        description: "Location created successfully!",
        duration: 3000,
      });
      // Invalidate query to ensure freshness
      queryClient.invalidateQueries({ queryKey: ["shop-owner-locations"] });
      return data;
    },
    onError: (error: any) => {
      console.error("Error creating location:", error);
      throw error;
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
      // Update cache immediately - use shopLocationId
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
        description: "Location updated successfully!",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["shop-owner-locations"] });
      return updatedLocation;
    },
    onError: (error: any) => {
      console.error("Error updating location:", error);
      throw error;
    },
  });

  const deleteLocation = useMutation({
    mutationFn: async (id: string) => {
      return await LocationAPI.deleteLocation(id);
    },
    onSuccess: (_, locationId) => {
      // Remove from cache immediately - use shopLocationId
      queryClient.setQueryData(
        ["shop-owner-locations"],
        (old: ShopLocation[] = []) =>
          old.filter((location) => location.shopLocationId !== locationId),
      );
      toast({
        description: "Location deleted successfully!",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["shop-owner-locations"] });
    },
    onError: (error: any) => {
      console.error("Error deleting location:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete location. Please try again.",
        duration: 3000,
      });
      throw error;
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
