import { useParams, useNavigate } from "react-router-dom";
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
import { RatingCard } from "@/components/booking/detail/RatingCard";
const RatingDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { useBookingById } = useBookings();
    const { data: booking, isLoading } = useBookingById(id);
    const { data: shopLocation } = useShopOwnerLocationById(booking?.shopLocationId);
    const { data: nailArtist } = useCustomerArtistById(booking?.nailArtistId);

    const isShopBooking = !!booking?.shopLocationId;
    const handleBack = () => navigate(-1);

    return (
        <div className="bg-slate-50">
            {isLoading ? (
                <BookingSkeleton />
            ) : booking ? (
                <main className="max-w-6xl mx-auto lg:p-10">
                    <BookingHeader bookingId={booking?.id} onBack={handleBack} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <div className="space-y-6">
                            <PriceSummaryCard
                                collectionName={booking.collectionName}
                                status={booking.status}
                                durationMinutes={booking.durationMinutes}
                                totalPrice={booking.totalPrice}
                            />

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
                                address={!isShopBooking ? booking.address : undefined}
                            />
                            <LocationInfo
                                shopLocation={shopLocation}
                                nailArtist={nailArtist}
                                booking={booking}
                            />
                            {booking.ratings && (
                                <RatingCard
                                    ratings={booking.ratings}
                                    comment={booking.comment}
                                />
                            )}
                        </div>
                    </div>
                </main>
            ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                    <p>Không tìm thấy lịch hẹn</p>
                </div>
            )}
        </div>
    );
};

export default RatingDetail;
