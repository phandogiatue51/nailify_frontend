import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useBookings } from "@/hooks/useBookings";
import { useShopOwnerLocationById } from "@/hooks/useLocation";
import { useCustomerArtistById } from "@/hooks/useCustomer";

import { BookingHeader } from "@/components/booking/detail/BookingHeader";
import { PriceSummaryCard } from "@/components/booking/detail/PriceSummaryCard";
import { DateTimeCard } from "@/components/booking/detail/DateTimeCard";
import { NotesCard } from "@/components/booking/detail/NotesCard";
import { HelpCard } from "@/components/booking/detail/HelpCard";
import { BookingSkeleton } from "@/components/booking/detail/BookingSkeleton";
import { ServiceItems } from "@/components/booking/detail/ServiceItems";
import { CustomerInfo } from "@/components/booking/detail/CustomerInfo";
import { LocationInfo } from "@/components/booking/detail/LocationInfo";
import { BookingActions } from "@/components/booking/detail/BookingActions";
import { useAuth } from "@/hooks/use-auth";
import { BookingStatus } from "@/types/database";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const BookingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const location = useLocation();

  const { useBookingById, cancelBooking, updateBookingStatus } = useBookings();
  const { data: booking, isLoading } = useBookingById(id);
  const { data: shopLocation } = useShopOwnerLocationById(
    booking?.shopLocationId,
  );
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(
    null,
  );

  const { data: nailArtist } = useCustomerArtistById(booking?.nailArtistId);
  const isShopOwner = user?.role === 1 || user?.role === 3 || user?.role === 4;

  useEffect(() => {
    if (location.state?.success) {
    }
  }, [location.state]);

  const handleStatusUpdate = (bookingId: string, status: BookingStatus) => {
    setUpdatingBookingId(bookingId);

    updateBookingStatus.mutate(
      { bookingId, status },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["booking", bookingId],
          });
          queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
        onSettled: () => {
          setUpdatingBookingId(null);
        },
      },
    );
  };

  const handleApprove = (bookingId: string) => handleStatusUpdate(bookingId, 1);

  const handleReject = (bookingId: string) => handleStatusUpdate(bookingId, 2);

  const handleCancel = (bookingId: string) => handleStatusUpdate(bookingId, 4);

  const handleComplete = (bookingId: string) =>
    handleStatusUpdate(bookingId, 3);

  const handleReschedule = () => {
    navigate(`/booking/reschedule/${id}`, {
      state: { booking },
    });
  };

  const handleBack = () => navigate(-1);

  return (
    <div className="min-h-screen bg-slate-50">
      <BookingHeader bookingId={booking?.id} onBack={handleBack} />

      {isLoading ? (
        <BookingSkeleton />
      ) : booking ? (
        <>
          <div className="p-4 max-w-4xl mx-auto space-y-6">
            <PriceSummaryCard
              collectionName={booking.collectionName}
              status={booking.status}
              durationMinutes={booking.durationMinutes}
              totalPrice={booking.totalPrice}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <DateTimeCard
                  scheduledStart={booking.scheduledStart}
                  scheduledEnd={booking.scheduledEnd}
                />

                <ServiceItems
                  items={booking.bookingItems}
                  totalPrice={booking.totalPrice}
                  duration={booking.durationMinutes}
                />

                <NotesCard notes={booking.notes} />
              </div>

              <div className="space-y-6">
                <CustomerInfo
                  name={booking.customerName}
                  phone={booking.customerPhone}
                  address={booking.address}
                />

                <LocationInfo
                  shopLocation={shopLocation}
                  nailArtist={nailArtist}
                  booking={booking}
                />

                <HelpCard />
              </div>
            </div>
            <BookingActions
              booking={booking}
              onCancel={handleCancel}
              onReschedule={handleReschedule}
              onApprove={isShopOwner ? handleApprove : undefined}
              onReject={isShopOwner ? handleReject : undefined}
              onComplete={isShopOwner ? handleComplete : undefined}
              isCancelling={cancelBooking.isPending}
              isUpdatingStatus={
                updateBookingStatus.isPending || updatingBookingId !== null
              }
              navigate={navigate}
              isShopOwner={isShopOwner}
            />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default BookingDetail;
