import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookingAPI, dashboardAPI } from "../services/api";
import { useAuth } from "./use-auth";
import { BookingStatus } from "@/types/database";
import { BookingFilterDto } from "@/types/filter";
import { BookingStats, CreateBookingParams, UpdateBookingParams } from "@/types/booking";
import { useToast } from "./use-toast";

export const useBookings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: customerBookings = [], isLoading: customerBookingsLoading } =
    useQuery({
      queryKey: ["customer-bookings", user?.userId],
      queryFn: async () => {
        if (!user?.userId) return [];
        return await BookingAPI.getByCustomer(user.userId);
      },
      enabled: !!user?.userId && user?.role === 0,
    });

  const useShopBookings = (shopId: string | undefined, date?: Date) => {
    return useQuery({
      queryKey: ["shop-bookings", shopId, date?.toISOString()],
      queryFn: async () => {
        if (!shopId) return [];
        return await BookingAPI.getByShop(shopId, date);
      },
      enabled: !!shopId,
    });
  };

  const { data: shopAuthBookings = [], isLoading: shopAuthBookingsLoading } =
    useQuery({
      queryKey: ["shop-auth-bookings"],
      queryFn: async () => {
        return await BookingAPI.getByShopAuth();
      },
      enabled: !!user?.userId && user?.role === 1,
    });

  const useLocationBookings = (shopLocationId: string | undefined, date?: Date) => {
    return useQuery({
      queryKey: ["location-bookings", shopLocationId, date?.toISOString()],
      queryFn: async () => {
        if (!shopLocationId) return [];
        return await BookingAPI.getByLocation(shopLocationId, date);
      },
      enabled: !!shopLocationId,  
    });
  };

  const useArtistBookings = (artistId: string | undefined, date?: Date) => {
    return useQuery({
      queryKey: ["artist-bookings", artistId, date?.toISOString()],
      queryFn: async () => {
        if (!artistId) return [];
        return await BookingAPI.getByArtist(artistId, date);
      },
      enabled: !!artistId,
    });
  };

  const { data: artistAuthBookings = [], isLoading: artistAuthBookingsLoading } =
    useQuery({
      queryKey: ["artist-auth-bookings"],
      queryFn: async () => {
        return await BookingAPI.getByArtistAuth();
      },
      enabled: !!user?.userId && user?.role === 2,
    });

  const useBookingById = (bookingId: string | undefined) => {
    return useQuery({
      queryKey: ["booking", bookingId],
      queryFn: async () => {
        if (!bookingId) return null;
        return await BookingAPI.getById(bookingId);
      },
      enabled: !!bookingId,
    });
  };

  const useFilterBookings = (filter: BookingFilterDto) => {
    return useQuery({
      queryKey: ["filter-bookings", filter],
      queryFn: async () => {
        return await BookingAPI.filter(filter);
      },
    });
  };

  const useShopStats = (shopId: string | undefined, startDate?: Date, endDate?: Date) => {
    return useQuery<BookingStats>({
      queryKey: ["shop-stats", shopId, startDate?.toISOString(), endDate?.toISOString()],
      queryFn: async () => {
        if (!shopId) throw new Error("Shop ID is required");
        return await dashboardAPI.getByShop(shopId, startDate?.toISOString(), endDate?.toISOString());
      },
      enabled: !!shopId,
    });
  };

  const useArtistStats = (artistId: string | undefined, startDate?: Date, endDate?: Date) => {
    return useQuery<BookingStats>({
      queryKey: ["artist-stats", artistId, startDate?.toISOString(), endDate?.toISOString()],
      queryFn: async () => {
        if (!artistId) throw new Error("Artist ID is required");
        return await dashboardAPI.getByArtist(artistId, startDate?.toISOString(), endDate?.toISOString());
      },
      enabled: !!artistId,
    });
  };

  const useLocationStats = (locationId: string | undefined, startDate?: Date, endDate?: Date) => {
    return useQuery<BookingStats>({
      queryKey: ["location-stats", locationId, startDate?.toISOString(), endDate?.toISOString()],
      queryFn: async () => {
        if (!locationId) throw new Error("Location ID is required");
        return await dashboardAPI.getByLocation(locationId, startDate?.toISOString(), endDate?.toISOString());
      },
      enabled: !!locationId,
    });
  };

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
  });

  const createBooking = useMutation({
    mutationFn: async (params: CreateBookingParams) => {
      const scheduledStart = new Date(`${params.bookingDate}T${params.bookingTime}`);

      const baseDto = {
        collectionId: params.collectionId || null,
        bookingItems: params.items?.map(item => ({ serviceItemId: item.serviceItemId })) || null,
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

      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["shop-auth-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["artist-auth-bookings"] });

      if (data.bookingId) {
        queryClient.invalidateQueries({ queryKey: ["booking", data.bookingId] });
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
  });

  // Update booking
  const updateBooking = useMutation({
    mutationFn: async ({ id, data }: UpdateBookingParams) => {
      const formData = new FormData();

      // Append only non-undefined values
      if (data.collectionId !== undefined) formData.append("collectionId", data.collectionId || "");
      if (data.scheduledStart) formData.append("scheduledStart", data.scheduledStart);
      if (data.notes !== undefined) formData.append("notes", data.notes || "");
      if (data.customerName !== undefined) formData.append("customerName", data.customerName || "");
      if (data.customerPhone !== undefined) formData.append("customerPhone", data.customerPhone || "");
      if (data.customerAddress !== undefined) formData.append("customerAddress", data.customerAddress || "");

      // Handle booking items
      if (data.bookingItems) {
        data.bookingItems.forEach((item, index) => {
          formData.append(`bookingItems[${index}].serviceItemId`, item.serviceItemId);
        });
      }

      return await BookingAPI.updateBooking(id, formData);
    },
    onSuccess: (data) => {
      toast({
        description: data.message || "Cập nhật đặt lịch thành công!",
        variant: "success",
        duration: 3000,
      });

      // Invalidate relevant queries
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
  });

  // Cancel booking
  const cancelBooking = useMutation({
    mutationFn: async (bookingId: string) => {
      return await BookingAPI.cancelBooking(bookingId);
    },
    onSuccess: (data) => {
      toast({
        description: data.message || "Hủy đặt lịch thành công!",
        variant: "success",
        duration: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["shop-auth-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["artist-auth-bookings"] });
    },
    onError: (error: any) => {
      console.error("Cancel booking error:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra khi hủy đặt lịch!",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  // Update booking status
  const updateBookingStatus = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: BookingStatus }) => {
      return await BookingAPI.updateStatus(bookingId, { status });
    },
    onSuccess: (data, variables) => {
      toast({
        description: data.message || "Cập nhật trạng thái thành công!",
        variant: "success",
        duration: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["shop-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["artist-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking", variables.bookingId] });
    },
    onError: (error: any) => {
      console.error("Update booking status error:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  return {
    customerBookings,
    customerBookingsLoading,
    useShopBookings,
    shopAuthBookings,
    shopAuthBookingsLoading,
    useLocationBookings,
    useArtistBookings,
    artistAuthBookings,
    artistAuthBookingsLoading,
    useBookingById,
    useFilterBookings,
    useShopStats,
    useArtistStats,
    useLocationStats,
    calculateBooking,
    createBooking,
    updateBooking,
    cancelBooking,
    updateBookingStatus,
  };
};