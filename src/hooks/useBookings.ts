import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Booking,
  BookingItem,
  BookingStatus,
  ServiceItem,
} from "@/types/database";
import { useAuth } from "@/contexts/AuthContext";

interface CreateBookingParams {
  shop_id: string;
  booking_date: string;
  booking_time: string;
  notes?: string;
  collection_id?: string;
  items: { service_item_id: string; price: number }[];
}

export const useBookings = () => {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();

  // Customer bookings
  const { data: customerBookings, isLoading: customerBookingsLoading } =
    useQuery({
      queryKey: ["customer-bookings", user?.id],
      queryFn: async () => {
        if (!user) return [];

        const { data, error } = await supabase
          .from("bookings")
          .select(
            `
          *,
          shop:shops(*),
          items:booking_items(
            *,
            service_item:service_items(*)
          )
        `,
          )
          .eq("customer_id", user.id)
          .order("booking_date", { ascending: true });

        if (error) throw error;
        return data as (Booking & {
          shop: any;
          items: (BookingItem & { service_item: ServiceItem })[];
        })[];
      },
      enabled: !!user && profile?.user_type === "customer",
    });

  // Shop owner bookings (for their shop)
  const useShopBookings = (shopId: string | undefined) => {
    return useQuery({
      queryKey: ["shop-bookings", shopId],
      queryFn: async () => {
        if (!shopId) return [];

        const { data, error } = await supabase
          .from("bookings")
          .select(
            `
            *,
            customer:profiles!bookings_customer_id_fkey(*),
            items:booking_items(
              *,
              service_item:service_items(*)
            )
          `,
          )
          .eq("shop_id", shopId)
          .order("booking_date", { ascending: true });

        if (error) throw error;
        return data as (Booking & {
          customer: any;
          items: (BookingItem & { service_item: ServiceItem })[];
        })[];
      },
      enabled: !!shopId,
    });
  };

  const createBooking = useMutation({
    mutationFn: async (params: CreateBookingParams) => {
      if (!user) throw new Error("Not authenticated");

      const totalPrice = params.items.reduce(
        (sum, item) => sum + item.price,
        0,
      );

      // Create booking
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          shop_id: params.shop_id,
          customer_id: user.id,
          booking_date: params.booking_date,
          booking_time: params.booking_time,
          notes: params.notes || null,
          collection_id: params.collection_id || null,
          total_price: totalPrice,
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Add booking items
      if (params.items.length > 0) {
        const { error: itemsError } = await supabase
          .from("booking_items")
          .insert(
            params.items.map((item) => ({
              booking_id: booking.id,
              service_item_id: item.service_item_id,
              price: item.price,
            })),
          );

        if (itemsError) throw itemsError;
      }

      return booking as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
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
      const { data, error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", bookingId)
        .select()
        .single();

      if (error) throw error;
      return data as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
    },
  });

  const cancelBooking = useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" as BookingStatus })
        .eq("id", bookingId);

      if (error) throw error;
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
