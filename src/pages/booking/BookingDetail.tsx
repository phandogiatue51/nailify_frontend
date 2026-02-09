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

const BookingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { useBookingById, cancelBooking } = useBookings();
  const { data: booking, isLoading, error } = useBookingById(id);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { data: shopLocation } = useShopOwnerLocationById(
    booking?.shopLocationId,
  );
  const { data: nailArtist } = useCustomerArtistById(booking?.nailArtistId);

  useEffect(() => {
    if (location.state?.success) {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  }, [location.state]);

  const handleCancelBooking = () => {
    if (!booking?.id) return;
    cancelBooking.mutate(booking.id, {
      onSuccess: () => {
        navigate(`/booking/detail/${id}`);
      },
    });
  };

  const handleReschedule = () => {
    navigate(`/booking/reschedule/${id}`, {
      state: { booking },
    });
  };

  const handleBack = () => navigate(-1);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
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
                  address={booking.customerAddress}
                />

                <LocationInfo
                  shopLocation={shopLocation}
                  nailArtist={nailArtist}
                  booking={booking}
                />

                <HelpCard />
              </div>
            </div>
          </div>

          <BookingActions
            booking={booking}
            onCancel={handleCancelBooking}
            onReschedule={handleReschedule}
            isCancelling={cancelBooking.isPending}
            navigate={navigate}
          />
        </>
      ) : null}
    </div>
  );
};

export default BookingDetail;
