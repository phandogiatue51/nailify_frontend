import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookingAPI } from "../services/api";
import { useAuth } from "./use-auth";
import { BookingStatus } from "@/types/database";

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
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: customerBookings = [], isLoading: customerBookingsLoading } =
    useQuery({
      queryKey: ["customer-bookings", user?.userId],
      queryFn: async () => {
        if (!user?.userId) return [];
        return await BookingAPI.getByCustomer(user.userId);
      },
      enabled: !!user?.userId && profile?.role === "Customer",
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
      return await BookingAPI.createBooking(bookingData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
    },
    onError: (error: any) => {
      console.error("Booking creation error:", error);
      throw error;
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
      return await BookingAPI.updateStatus(bookingId, status);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["shop-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });

      queryClient.invalidateQueries({
        queryKey: ["booking", variables.bookingId],
      });
    },
    onError: (error: any) => {
      console.error("Update booking status error:", error);
      throw error;
    },
  });

  const cancelBooking = useMutation({
    mutationFn: async (bookingId: string) => {
      return await BookingAPI.updateStatus(
        bookingId,
        "Cancelled" as BookingStatus,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
    },
  });

  return {
    customerBookings,
    customerBookingsLoading,
    useShopBookings,
    createBooking,
    updateBookingStatus,
    cancelBooking,
  };
};
