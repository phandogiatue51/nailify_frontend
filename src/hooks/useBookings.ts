import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookingAPI, dashboardAPI } from "../services/api";
import { useAuth } from "./use-auth";
import { BookingStatus } from "@/types/database";
import { BookingFilterDto } from "@/types/filter";
import {
  BookingStats,
  CreateBookingParams,
  UpdateBookingParams,
} from "@/types/booking";
import { useToast } from "./use-toast";

const BOOKING_QUERY_CONFIG = {
  refetchOnWindowFocus: false,
  staleTime: 10 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  retry: 1,
};

export const useBookings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: customerBookings = [],
    isLoading: customerBookingsLoading,
    refetch: refetchCustomerBookings,
  } = useQuery({
    queryKey: ["customer-bookings", user?.userId],
    queryFn: async () => {
      if (!user?.userId) return [];
      return await BookingAPI.getByCustomer(user.userId);
    },
    enabled: !!user?.userId && user?.role === 0,
    ...BOOKING_QUERY_CONFIG,
  });

  const {
    data: shopAuthBookings = [],
    isLoading: shopAuthBookingsLoading,
    refetch: refetchShopAuthBookings,
  } = useQuery({
    queryKey: ["shop-auth-bookings", user?.userId],
    queryFn: async () => {
      return await BookingAPI.getByShopAuth();
    },
    enabled: !!user?.userId && user?.role === 1,
    ...BOOKING_QUERY_CONFIG,
  });

  // Artist bookings (for artists only)
  const {
    data: artistAuthBookings = [],
    isLoading: artistAuthBookingsLoading,
    refetch: refetchArtistAuthBookings,
  } = useQuery({
    queryKey: ["artist-auth-bookings", user?.userId],
    queryFn: async () => {
      return await BookingAPI.getByArtistAuth();
    },
    enabled: !!user?.userId && user?.role === 2,
    ...BOOKING_QUERY_CONFIG,
  });

  const {
    data: staffAuthBookings = [],
    isLoading: staffAuthBookingsLoading,
    refetch: refetchstaffAuthBookings,
  } = useQuery({
    queryKey: ["staff-auth-bookings", user?.shopLocationId],
    queryFn: async () => {
      return await BookingAPI.getByLocationAuth();
    },
    enabled: !!user?.userId && user?.role === 3,
    ...BOOKING_QUERY_CONFIG,
  });

  // Mutation for calculating booking summary
  const calculateBooking = useMutation({
    mutationFn: async (dto: {
      collectionId?: string | null;
      serviceItemIds?: string[] | null;
      previewDate?: string | null;
      shopLocationId?: string | null;
      nailArtistId?: string | null;
    }) => {
      return await BookingAPI.getSummary(dto);
    },
    retry: 1,
  });

  const filterBookings = useMutation({
    mutationFn: async (filter: BookingFilterDto) => {
      return await BookingAPI.filter(filter);
    },
    onSuccess: (data, filters) => {
      queryClient.setQueryData(["filteredBookings", filters], data);
    },
  });

  const useShopBookings = (
    shopId: string | undefined,
    date?: Date | string,
  ) => {
    const isoDate = toIsoStringSafe(date);
    return useQuery({
      queryKey: ["shop-bookings", shopId, isoDate],
      queryFn: async () => {
        if (!shopId) return [];
        return await BookingAPI.getByShop(
          shopId,
          isoDate ? new Date(isoDate) : undefined,
        );
      },
      enabled: !!shopId,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 15 * 60 * 1000,
    });
  };

  const useBookingById = (bookingId: string | undefined) => {
    return useQuery({
      queryKey: ["booking", bookingId],
      queryFn: async () => {
        if (!bookingId) return null;
        return await BookingAPI.getById(bookingId);
      },
      enabled: !!bookingId,
      refetchOnWindowFocus: false,
      staleTime: 2 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    });
  };

  // Mutation for creating booking
  const createBooking = useMutation({
    mutationFn: async (params: CreateBookingParams) => {
      const scheduledStart = new Date(
        `${params.bookingDate}T${params.bookingTime}`,
      );

      const baseDto = {
        collectionId: params.collectionId || null,
        bookingItems:
          params.items?.map((item) => ({
            serviceItemId: item.serviceItemId,
          })) || null,
        scheduledStart: scheduledStart.toISOString(),
        notes: params.notes || null,
      };

      switch (params.bookingType) {
        case "CustomerBooking":
          const customerDto = {
            ...baseDto,
            shopLocationId: params.shopLocationId || null,
            nailArtistId: params.nailArtistId || null,
          };
          return await BookingAPI.createUserBooking(customerDto);

        case "ArtistBooking":
          const artistDto = {
            ...baseDto,
            nailArtistId: params.nailArtistId,
            customerId: params.customerId || null,
            customerName: params.customerName || null,
            customerPhone: params.customerPhone || null,
            address: params.customerAddress || null,
          };
          return await BookingAPI.createArtistBooking(artistDto);

        case "ShopBooking":
          const shopDto = {
            ...baseDto,
            shopLocationId: params.shopLocationId!,
            customerId: params.customerId || null,
            customerName: params.customerName || null,
            customerPhone: params.customerPhone || null,
          };
          return await BookingAPI.createShopBooking(shopDto);

        default:
          throw new Error("Invalid booking type");
      }
    },
    onSuccess: (data) => {
      toast({
        description: data.message || "Đặt lịch thành công!",
        variant: "success",
        duration: 3000,
      });

      // Invalidate relevant queries based on user role
      if (user?.role === 0) {
        queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
      } else if (user?.role === 1) {
        queryClient.invalidateQueries({ queryKey: ["shop-auth-bookings"] });
      } else if (user?.role === 2) {
        queryClient.invalidateQueries({ queryKey: ["artist-auth-bookings"] });
      }

      // Also invalidate the specific booking if ID exists
      if (data.bookingId) {
        queryClient.invalidateQueries({
          queryKey: ["booking", data.bookingId],
        });
      }
    },
    onError: (error: any) => {
      console.error("Booking creation error:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra khi đặt lịch!",
        variant: "destructive",
        duration: 5000,
      });
    },
    retry: 1,
  });

  const updateBooking = useMutation({
    mutationFn: async ({ id, data }: UpdateBookingParams) => {
      const payload = {
        collectionId: data.collectionId || null,
        scheduledStart: data.scheduledStart,
        notes: data.notes || null,
        customerName: data.customerName || null,
        customerPhone: data.customerPhone || null,
        customerAddress: data.customerAddress || null,
        bookingItems:
          data.bookingItems?.map((item) => ({
            serviceItemId: item.serviceItemId,
          })) || [],
      };

      return await BookingAPI.updateBooking(id, payload);
    },
    onSuccess: (data) => {
      toast({
        description: data.message || "Cập nhật đặt lịch thành công!",
        variant: "success",
        duration: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["shop-auth-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["artist-auth-bookings"] });
    },
    onError: (error: any) => {
      console.error("Update booking error:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra khi cập nhật!",
        variant: "destructive",
        duration: 5000,
      });
    },
    retry: 1,
  });

  const cancelBooking = useMutation({
    mutationFn: async (bookingId: string) => {
      return await BookingAPI.cancelBooking(bookingId);
    },
    onSuccess: (data, bookingId) => {
      toast({
        description: data.message,
        variant: "success",
        duration: 3000,
      });

      if (user?.role === 0) {
        queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
      } else if (user?.role === 1) {
        queryClient.invalidateQueries({ queryKey: ["shop-auth-bookings"] });
      } else if (user?.role === 2) {
        queryClient.invalidateQueries({ queryKey: ["artist-auth-bookings"] });
      }

      queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });

      queryClient.refetchQueries({ queryKey: ["booking", bookingId] });
    },
    onError: (error: any) => {
      console.error("Cancel booking error:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra khi hủy đặt lịch!",
        variant: "destructive",
        duration: 5000,
      });
    },
    retry: 1,
  });

  const updateBookingStatus = useMutation({
    mutationFn: async ({
      bookingId,
      status,
    }: {
      bookingId: string;
      status: BookingStatus;
    }) => {
      console.log("DEBUG: mutationFn called with:", { bookingId, status });
      return await BookingAPI.updateStatus(bookingId, status);
    },

    // Optimistic update - runs BEFORE mutationFn
    onMutate: async ({ bookingId, status }) => {
      // Cancel any outgoing refetches to prevent them from overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ["booking", bookingId] });
      await queryClient.cancelQueries({ queryKey: ["customer-bookings"] });
      await queryClient.cancelQueries({ queryKey: ["shop-auth-bookings"] });
      await queryClient.cancelQueries({ queryKey: ["artist-auth-bookings"] });
      await queryClient.cancelQueries({ queryKey: ["staff-auth-bookings"] });
      await queryClient.cancelQueries({ queryKey: ["filteredBookings"] });
      await queryClient.cancelQueries({ queryKey: ["bookings"] });

      // Snapshot the previous values for rollback
      const previousBooking = queryClient.getQueryData(["booking", bookingId]);
      const previousCustomerBookings = queryClient.getQueryData([
        "customer-bookings",
      ]);
      const previousShopBookings = queryClient.getQueryData([
        "shop-auth-bookings",
      ]);
      const previousArtistBookings = queryClient.getQueryData([
        "artist-auth-bookings",
      ]);
      const previousStaffBookings = queryClient.getQueryData([
        "staff-auth-bookings",
      ]);
      const previousFilteredBookings = queryClient.getQueryData([
        "filteredBookings",
      ]);

      // Optimistically update the individual booking
      queryClient.setQueryData(["booking", bookingId], (old: any) => {
        if (!old) return old;
        return { ...old, status };
      });

      // Optimistically update all booking lists
      const updateBookingInList = (old: any[] | undefined) => {
        if (!old) return old;
        return old.map((booking: any) =>
          booking.id === bookingId ? { ...booking, status } : booking,
        );
      };

      queryClient.setQueriesData(
        { queryKey: ["customer-bookings"] },
        updateBookingInList,
      );
      queryClient.setQueriesData(
        { queryKey: ["shop-auth-bookings"] },
        updateBookingInList,
      );
      queryClient.setQueriesData(
        { queryKey: ["artist-auth-bookings"] },
        updateBookingInList,
      );
      queryClient.setQueriesData(
        { queryKey: ["staff-auth-bookings"] },
        updateBookingInList,
      );
      queryClient.setQueriesData(
        { queryKey: ["filteredBookings"] },
        updateBookingInList,
      );
      queryClient.setQueriesData(
        { queryKey: ["bookings"] },
        updateBookingInList,
      );

      // Return context with snapshots for rollback
      return {
        previousBooking,
        previousCustomerBookings,
        previousShopBookings,
        previousArtistBookings,
        previousStaffBookings,
        previousFilteredBookings,
      };
    },

    // If mutation succeeds, invalidate to ensure consistency with server
    onSuccess: (data, variables, context) => {
      toast({
        description: data.message,
        variant: "success",
        duration: 3000,
      });

      // Invalidate all relevant queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["shop-auth-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["artist-auth-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["staff-auth-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["filteredBookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({
        queryKey: ["booking", variables.bookingId],
      });

      // Also invalidate location/date specific queries
      queryClient.invalidateQueries({ queryKey: ["location-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["artist-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["shop-bookings"] });
    },

    // If mutation fails, rollback to previous values
    onError: (error: any, variables, context) => {
      console.error("Update booking status error:", error);

      // Rollback individual booking
      if (context?.previousBooking) {
        queryClient.setQueryData(
          ["booking", variables.bookingId],
          context.previousBooking,
        );
      }

      // Rollback booking lists
      if (context?.previousCustomerBookings) {
        queryClient.setQueryData(
          ["customer-bookings"],
          context.previousCustomerBookings,
        );
      }
      if (context?.previousShopBookings) {
        queryClient.setQueryData(
          ["shop-auth-bookings"],
          context.previousShopBookings,
        );
      }
      if (context?.previousArtistBookings) {
        queryClient.setQueryData(
          ["artist-auth-bookings"],
          context.previousArtistBookings,
        );
      }
      if (context?.previousStaffBookings) {
        queryClient.setQueryData(
          ["staff-auth-bookings"],
          context.previousStaffBookings,
        );
      }
      if (context?.previousFilteredBookings) {
        queryClient.setQueryData(
          ["filteredBookings"],
          context.previousFilteredBookings,
        );
      }

      toast({
        description: error?.message || "Failed to update booking status",
        variant: "destructive",
        duration: 5000,
      });
    },

    // Always refetch after error or success to ensure consistency
    onSettled: (data, error, variables) => {
      // Optionally refetch critical data
      queryClient.refetchQueries({
        queryKey: ["booking", variables.bookingId],
      });
    },

    retry: 1,
  });

  const useLocationBookings = (
    shopLocationId: string | undefined,
    date?: Date | string,
  ) => {
    const isoDate = toIsoStringSafe(date);

    return useQuery({
      queryKey: ["location-bookings", shopLocationId, isoDate],
      queryFn: async () => {
        if (!shopLocationId) return [];
        return await BookingAPI.getAvailableByLocation(
          shopLocationId,
          isoDate ? new Date(isoDate) : undefined,
        );
      },
      enabled: !!shopLocationId,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 15 * 60 * 1000,
    });
  };

  const useArtistBookings = (date?: Date | string) => {
    const isoDate = toIsoStringSafe(date);

    return useQuery({
      queryKey: ["artist-bookings", isoDate],
      queryFn: async () => {
        return await BookingAPI.getAvailableByArtist(
          isoDate ? new Date(isoDate) : undefined,
        );
      },
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 15 * 60 * 1000,
    });
  };

  // Helper function to refetch all booking data
  const refetchAllBookings = async () => {
    const promises = [];

    if (user?.role === 0) {
      promises.push(refetchCustomerBookings());
    } else if (user?.role === 1) {
      promises.push(refetchShopAuthBookings());
    } else if (user?.role === 2) {
      promises.push(refetchArtistAuthBookings());
    }

    await Promise.all(promises);
  };

  return {
    customerBookings,
    customerBookingsLoading,
    shopAuthBookings,
    shopAuthBookingsLoading,
    artistAuthBookings,
    artistAuthBookingsLoading,
    staffAuthBookings,
    staffAuthBookingsLoading,
    useLocationBookings,
    useArtistBookings,
    refetchCustomerBookings,
    refetchShopAuthBookings,
    refetchArtistAuthBookings,
    refetchstaffAuthBookings,
    refetchAllBookings,
    filterBookings,
    useBookingById,
    useShopBookings,
    calculateBooking,
    createBooking,
    updateBooking,
    cancelBooking,
    updateBookingStatus,
  };
};

export const useShopBookings = (
  shopId: string | undefined,
  date?: Date | string,
) => {
  const isoDate = toIsoStringSafe(date);

  return useQuery({
    queryKey: ["shop-bookings", shopId, isoDate],
    queryFn: async () => {
      if (!shopId) return [];
      return await BookingAPI.getByShop(
        shopId,
        isoDate ? new Date(isoDate) : undefined,
      );
    },
    enabled: !!shopId,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

export const useBookingById = (bookingId: string | undefined) => {
  return useQuery({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      if (!bookingId) return null;
      return await BookingAPI.getById(bookingId);
    },
    enabled: !!bookingId,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useShopStats = (
  shopId: string | undefined,
  startDate?: Date,
  endDate?: Date,
) => {
  return useQuery<BookingStats>({
    queryKey: [
      "shop-stats",
      shopId,
      startDate?.toISOString(),
      endDate?.toISOString(),
    ],
    queryFn: async () => {
      if (!shopId) throw new Error("Shop ID is required");
      return await dashboardAPI.getByShop(
        shopId,
        startDate?.toISOString(),
        endDate?.toISOString(),
      );
    },
    enabled: !!shopId,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

function toIsoStringSafe(date?: Date | string) {
  if (!date) return undefined;
  const d = date instanceof Date ? date : new Date(date);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}
