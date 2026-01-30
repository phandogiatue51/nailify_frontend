import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookingAPI } from "../services/api";
import { useAuth } from "./use-auth";
import { BookingStatus } from "@/types/database";
import { useToast } from "./use-toast";
interface CreateBookingParams {
  shopId: string;
  bookingDate: string;
  bookingTime: string;
  notes?: string;
  collectionId?: string;
  items: { serviceItemId: string }[];
  customerName?: string;
  customerPhone?: string;
}

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

  const useShopBookings = (shopId: string | undefined) => {
    return useQuery({
      queryKey: ["shop-bookings", shopId],
      queryFn: async () => {
        if (!shopId) return [];
        return await BookingAPI.getByShop(shopId);
      },
      enabled: !!shopId,
    });
  };

  const createBooking = useMutation({
    mutationFn: async (params: CreateBookingParams) => {
      const bookingData = {
        shopId: params.shopId,
        customerId: user?.userId,
        customerName: params.customerName,
        customerPhone: params.customerPhone,
        collectionId: params.collectionId,
        bookingItems: params.items.map((item) => ({
          serviceItemId: item.serviceItemId,
        })),
        bookingDate: params.bookingDate,
        bookingTime: params.bookingTime,
        notes: params.notes,
      };
      //const response = await BookingAPI.createBooking(bookingData);
    },
    onSuccess: () => {
      toast({
        //description: response.message,
        variant: "success",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
    },
    onError: (error: any) => {
      console.error("Booking creation error:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  const updateBookingStatus = useMutation({
    mutationFn: async ({
      bookingId,
      status,
    }: {
      bookingId: string;
      status: BookingStatus;
    }) => {
      const response = await BookingAPI.updateStatus(bookingId, status);
    },
    onSuccess: (data, variables) => {
      toast({
        //description: response.message,
        variant: "success",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["shop-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
      queryClient.invalidateQueries({
        queryKey: ["booking", variables.bookingId],
      });
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

  const cancelBooking = useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await BookingAPI.updateStatus(bookingId, 4);
    },
    onSuccess: () => {
      toast({
        //description: response.message,
        variant: "success",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
    },
    onError: (error: any) => {
      console.error("Cancel booking error:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  const useArtistBookings = (artistId: string | undefined) => {
    return useQuery({
      queryKey: ["artist-bookings", artistId],
      queryFn: async () => {
        if (!artistId) return [];
        try {
          return await BookingAPI.getByArtist(artistId);
        } catch (error: any) {
          console.error("Error fetching artist bookings:", error);
          return [];
        }
      },
      enabled: !!artistId,
    });
  };

  return {
    customerBookings,
    customerBookingsLoading,
    useShopBookings,
    createBooking,
    updateBookingStatus,
    cancelBooking,
    useArtistBookings,
  };
};
