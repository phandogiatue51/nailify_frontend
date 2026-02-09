import { useQuery } from "@tanstack/react-query";
import { dashboardAPI } from "@/services/api";
import { ServiceItemFilterDto } from "@/types/filter";
import { UseDashboardOptions } from "@/types/database";

export const useDashboard = () => {
  const useQuickStats = (params: {
    shopId?: string;
    artistId?: string;
    shopLocationId?: string;
  }) => {
    return useQuery({
      queryKey: ["dashboard", "quick", params],
      queryFn: () => dashboardAPI.getQuickStats(params),
      enabled: Boolean(
        params.shopId || params.artistId || params.shopLocationId,
      ),
    });
  };

  const useStats = (options: UseDashboardOptions) => {
    const {
      shopId,
      artistId,
      shopLocationId,
      startDate,
      endDate,
      enabled = true,
    } = options;

    return useQuery({
      queryKey: [
        "dashboard",
        "stats",
        { shopId, artistId, shopLocationId, startDate, endDate },
      ],
      queryFn: () =>
        dashboardAPI.getStats({
          shopId,
          artistId,
          shopLocationId,
          startDate,
          endDate,
        }),
      enabled: enabled && Boolean(shopId || artistId || shopLocationId),
    });
  };

  const useShopAuthDashboard = (startDate?: string, endDate?: string) => {
    return useQuery({
      queryKey: ["dashboard", "shop-auth", { startDate, endDate }],
      queryFn: () => dashboardAPI.getByShopAuth(startDate, endDate),
    });
  };

  const useShopDashboard = (
    shopId: string,
    startDate?: string,
    endDate?: string,
  ) => {
    return useQuery({
      queryKey: ["dashboard", "shop", shopId, { startDate, endDate }],
      queryFn: () => dashboardAPI.getByShop(shopId, startDate, endDate),
      enabled: !!shopId,
    });
  };

  const useArtistAuthDashboard = (startDate?: string, endDate?: string) => {
    return useQuery({
      queryKey: ["dashboard", "artist-auth", { startDate, endDate }],
      queryFn: () => dashboardAPI.getByArtistAuth(startDate, endDate),
    });
  };

  const useArtistDashboard = (
    artistId: string,
    startDate?: string,
    endDate?: string,
  ) => {
    return useQuery({
      queryKey: ["dashboard", "artist", artistId, { startDate, endDate }],
      queryFn: () => dashboardAPI.getByArtist(artistId, startDate, endDate),
      enabled: !!artistId,
    });
  };

  const useLocationDashboard = (
    shopLocationId: string,
    startDate?: string,
    endDate?: string,
  ) => {
    return useQuery({
      queryKey: [
        "dashboard",
        "location",
        shopLocationId,
        { startDate, endDate },
      ],
      queryFn: () =>
        dashboardAPI.getByLocation(shopLocationId, startDate, endDate),
      enabled: !!shopLocationId,
    });
  };

  const useCustomerFilterDashboard = (filterParams: ServiceItemFilterDto) => {
    return useQuery({
      queryKey: ["dashboard", "customer-filter", filterParams],
      queryFn: () => dashboardAPI.customerFilter(filterParams),
    });
  };

  return {
    useQuickStats,
    useStats,
    useShopAuthDashboard,
    useShopDashboard,
    useArtistAuthDashboard,
    useArtistDashboard,
    useLocationDashboard,
    useCustomerFilterDashboard,
  };
};

export const useCommonDateRanges = () => {
  const getTodayRange = () => {
    const today = new Date();
    const startDate = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const endDate = new Date(today.setHours(23, 59, 59, 999)).toISOString();
    return { startDate, endDate };
  };

  const getLast7DaysRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  };

  const getLast30DaysRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  };

  const getThisMonthRange = () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  };

  return {
    getTodayRange,
    getLast7DaysRange,
    getLast30DaysRange,
    getThisMonthRange,
  };
};
