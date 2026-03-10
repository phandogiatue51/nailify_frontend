import { useQuery, useQueries, UseQueryResult, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '@/services/api';
import { FourWidgetDto, DashboardState } from '@/types/database';
import { ChartPoint } from '@/types/database';

export const useWidgets = () => {
  return useQuery<FourWidgetDto>({
    queryKey: ['admin', 'widgets'],
    queryFn: adminAPI.getWidgets,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useTopShops = (options?: { enabled?: boolean }) => {
  return useQuery<ChartPoint[]>({
    queryKey: ['admin', 'top-shops'],
    queryFn: adminAPI.getTopShops,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useTopArtists = (options?: { enabled?: boolean }) => {
  return useQuery<ChartPoint[]>({
    queryKey: ['admin', 'top-artists'],
    queryFn: adminAPI.getTopArtists,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useCustomerGrowth = (options?: { enabled?: boolean }) => {
  return useQuery<ChartPoint[]>({
    queryKey: ['admin', 'customer-growth'],
    queryFn: adminAPI.getCustomerGrowth,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useRatingsBreakdown = (options?: { enabled?: boolean }) => {
  return useQuery<ChartPoint[]>({
    queryKey: ['admin', 'ratings-breakdown'],
    queryFn: adminAPI.getRatingsBreakdown,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
};


export const useAdminDashboard = (): DashboardState => {
  const results = useQueries({
    queries: [
      {
        queryKey: ['admin', 'widgets'],
        queryFn: adminAPI.getWidgets,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ['admin', 'top-shops'],
        queryFn: adminAPI.getTopShops,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ['admin', 'top-artists'],
        queryFn: adminAPI.getTopArtists,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ['admin', 'customer-growth'],
        queryFn: adminAPI.getCustomerGrowth,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ['admin', 'ratings-breakdown'],
        queryFn: adminAPI.getRatingsBreakdown,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
    ],
  });

  const [
    widgetsResult,
    topShopsResult,
    topArtistsResult,
    customerGrowthResult,
    ratingsBreakdownResult,
  ] = results;

  const isLoading = results.some(result => result.isLoading);
  const isError = results.some(result => result.isError);
  const errors = results.map(result => result.error);

  const refetchAll = () => {
    results.forEach(result => {
      if (result.refetch) {
        result.refetch();
      }
    });
  };

  return {
    data: {
      widgets: widgetsResult.data,
      topShops: topShopsResult.data,
      topArtists: topArtistsResult.data,
      customerGrowth: customerGrowthResult.data,
      ratingsBreakdown: ratingsBreakdownResult.data,
    },
    isLoading,
    isError,
    errors,
    refetchAll,
  };
};

export const usePrefetchAdmin = () => {
  const queryClient = useQueryClient();

  const prefetchAll = async () => {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ['admin', 'widgets'],
        queryFn: adminAPI.getWidgets,
      }),
      queryClient.prefetchQuery({
        queryKey: ['admin', 'top-shops'],
        queryFn: adminAPI.getTopShops,
      }),
      queryClient.prefetchQuery({
        queryKey: ['admin', 'top-artists'],
        queryFn: adminAPI.getTopArtists,
      }),
      queryClient.prefetchQuery({
        queryKey: ['admin', 'customer-growth'],
        queryFn: adminAPI.getCustomerGrowth,
      }),
      queryClient.prefetchQuery({
        queryKey: ['admin', 'ratings-breakdown'],
        queryFn: adminAPI.getRatingsBreakdown,
      }),
    ]);
  };

  return { prefetchAll };
};