import { GuestInfoForm, GuestInfoFormData } from "@/components/booking/GuestInfoProps";
import { useBookingById } from "@/hooks/useBookings";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookingAPI } from "@/services/api";
import { useNavigate, useParams } from "react-router-dom"; // Add useParams
import { useToast } from "@/components/ui/use-toasts";
export const UpdateGuestPage = () => { // Remove props
    const { bookingId } = useParams<{ bookingId: string }>(); // Get bookingId from URL
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { data: booking, isLoading } = useBookingById(bookingId);

    const updateBooking = useMutation({
        mutationFn: async (data: GuestInfoFormData) => {
            const payload = {
                customerName: data.fullName,
                customerPhone: data.phone,
                customerAddress: data.address,
            };
            return await BookingAPI.updateBooking(bookingId!, payload); // Add ! since we know it exists
        },
        onSuccess: (data) => {
            toast({
                description: data.message || "Cập nhật đặt lịch thành công!",
                variant: "success",
                duration: 3000,
            });
            queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
            queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });

            navigate(`/booking/detail/${bookingId}`);

        },
        onError: (error: any) => {
            toast({
                description: error?.message || "Failed to update customer info",
                variant: "destructive",
                duration: 5000,
            });
        },

    });

    const handleSubmit = (data: GuestInfoFormData) => {
        updateBooking.mutate(data);
    };

    // Handle case when bookingId is not in URL
    if (!bookingId) {
        return <div>No booking ID provided</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <GuestInfoForm
            mode="update"
            bookingId={bookingId}
            initialData={{
                customerName: booking?.customerName,
                customerPhone: booking?.customerPhone,
                customerAddress: booking?.customerAddress,
            }}
            onSubmit={handleSubmit}
            isSubmitting={updateBooking.isPending}
            nextButtonText="Update Customer Info"
        />
    );
};