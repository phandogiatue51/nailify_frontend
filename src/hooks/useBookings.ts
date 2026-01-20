// import {
//   BookingStatus,
// } from "@/types/database";
// import { useAuth } from "./use-auth";
// import bookingAPI from "../services/api";

// interface CreateBookingParams {
//   shopId: string;
//   bookingDate: string;
//   bookingTime: string;
//   notes?: string;
//   collectionId?: string;
//   items: { serviceItemId: string; price: number }[];
// }

// export const useBookings = () => {
//   const { user, profile } = useAuth();
//   const queryClient = useQueryClient();

//   const { data: customerBookings, isLoading: customerBookingsLoading } =
//     useQuery({
//       queryKey: ["customer-bookings", user?.id],
//       queryFn: async () => {
//         if (!user) return [];

//         return await bookingAPI.getByCustomer(user.id);

//       },
//       enabled: !!user && profile?.role === "Customer",
//     });

//   const useShopBookings = (shopId: string | undefined) => {
//     return useQuery({
//       queryKey: ["shop-bookings", shopId],
//       queryFn: async () => {
//         if (!shopId) return [];

//         return await bookingAPI.getByShop(shopId);
//       },
//       enabled: !!shopId,
//     });
//   };

//   const createBooking = useMutation({
//     mutationFn: async (params: CreateBookingParams) => {
//       if (!user) throw new Error("Not authenticated");

//       const bookingData = {
//         shopId: params.shopId,
//         customerId: user.id,
//         bookingDate: params.bookingDate,
//         bookingTime: params.bookingTime,
//         notes: params.notes,
//         collectionId: params.collectionId,
//         items: params.items,
//         status: "Pending" as BookingStatus,
//       };

//       return await bookingAPI.create(bookingData);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
//     },
//   });

//   const updateBookingStatus = useMutation({
//     mutationFn: async ({
//       bookingId,
//       status,
//     }: {
//       bookingId: string;
//       status: BookingStatus;
//     }) => {
//       return await bookingAPI.updateStatus(bookingId, status);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["shop-bookings"] });
//       queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
//     },
//   });

//   const cancelBooking = useMutation({
//     mutationFn: async (bookingId: string) => {
//       return await bookingAPI.updateStatus(bookingId, "Cancelled" as BookingStatus);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
//     },
//   });

//   return {
//     customerBookings,
//     customerBookingsLoading,
//     useShopBookings,
//     createBooking,
//     updateBookingStatus,
//     cancelBooking,
//   };
// };