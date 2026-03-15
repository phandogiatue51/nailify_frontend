import { useQuery } from "@tanstack/react-query";
import { insightAPI } from "@/services/api";
import { BusinessInsight, CustomerInsight } from "@/types/database";
import { InsightFilters } from "@/types/filter";

export const insightKeys = {
  all: ["insights"] as const,
  customer: () => [...insightKeys.all, "customer"] as const,
  shop: (filters?: InsightFilters) =>
    [...insightKeys.all, "shop", filters] as const,
  artist: (filters?: InsightFilters) =>
    [...insightKeys.all, "artist", filters] as const,
  shopLocation: (id?: string, filters?: InsightFilters) =>
    [...insightKeys.all, "shopLocation", id, filters] as const,
  shopLocationAuth: (filters?: InsightFilters) =>
    [...insightKeys.all, "shopLocationAuth", filters] as const,
};

export const useCustomerInsights = () => {
  return useQuery({
    queryKey: insightKeys.customer(),
    queryFn: async () => {
      const response = await insightAPI.customer();
      if (response) {
        return response as CustomerInsight;
      }
    },
  });
};

export const useShopInsights = (filters?: InsightFilters) => {
  return useQuery({
    queryKey: insightKeys.shop(filters),
    queryFn: async () => {
      const response = await insightAPI.shop(filters);
      if (response) {
        return response as BusinessInsight;
      }
    },
  });
};

export const useArtistInsights = (filters?: InsightFilters) => {
  return useQuery({
    queryKey: insightKeys.artist(filters),
    queryFn: async () => {
      const response = await insightAPI.artist(filters);
      if (response) {
        return response as BusinessInsight;
      }
    },
  });
};

export const useShopLocationInsights = (
  shopLocationId: string,
  filters?: InsightFilters,
) => {
  return useQuery({
    queryKey: insightKeys.shopLocation(shopLocationId, filters),
    queryFn: async () => {
      const response = await insightAPI.shopLocation(shopLocationId, filters);
      if (response) {
        return response as BusinessInsight;
      }
    },
    enabled: !!shopLocationId,
  });
};

export const useShopLocationAuthInsights = (filters?: InsightFilters) => {
  return useQuery({
    queryKey: insightKeys.shopLocationAuth(filters),
    queryFn: async () => {
      const response = await insightAPI.shopLocationAuth(filters);
      if (response) {
        return response as BusinessInsight;
      }
    },
  });
};

export const useThisWeekShopInsights = () => {
  return useShopInsights({ thisWeek: true });
};

export const useThisWeekArtistInsights = () => {
  return useArtistInsights({ thisWeek: true });
};

export const useThisWeekShopLocationAuthInsights = () => {
  return useShopLocationAuthInsights({ thisWeek: true });
};

export const useThisMonthShopInsights = () => {
  return useShopInsights({ thisMonth: true });
};

export const useThisMonthArtistInsights = () => {
  return useArtistInsights({ thisMonth: true });
};

export const useThisMonthShopLocationAuthInsights = () => {
  return useShopLocationAuthInsights({ thisMonth: true });
};

export const useDateRangeShopInsights = (
  startDate: string,
  endDate: string,
) => {
  return useShopInsights({ startDate, endDate });
};

export const useDateRangeArtistInsights = (
  startDate: string,
  endDate: string,
) => {
  return useArtistInsights({ startDate, endDate });
};

export const useDateRangeShopLocationInsights = (
  startDate: string,
  endDate: string,
) => {
  return useShopLocationAuthInsights({ startDate, endDate });
};
