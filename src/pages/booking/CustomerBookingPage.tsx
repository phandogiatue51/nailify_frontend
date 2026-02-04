import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { useBookings } from "@/hooks/useBookings";
import { useLocationsByShop } from "@/hooks/useLocation";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import { LocationSelector } from "@/components/shop/LocationSelector";

const CustomerBookingPage = () => {
    const { shopId } = useParams<{ shopId: string }>();
    const navigate = useNavigate();
    const locationState = useLocation();
    const { user } = useAuthContext();

    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [notes, setNotes] = useState<string>("");

    const { data: locations = [], isLoading: locationsLoading } = useLocationsByShop(shopId);

    const { data: bookings = [], isLoading: bookingsLoading } = useBookings().useLocationBookings(
        selectedLocation,
        selectedDate ? new Date(selectedDate) : undefined
    );

    const selectedItems = locationState.state?.selectedItems || [];
    const selectedCollection = locationState.state?.selectedCollection;

    const { createBooking } = useBookings();

    useEffect(() => {
        if (locations.length > 0 && !selectedLocation) {
            setSelectedLocation(locations[0].shopLocationId);
        }
    }, [locations, selectedLocation]);

    const totalPrice = selectedItems.reduce((sum, item) => sum + Number(item.price), 0);
    const totalDuration = selectedItems.reduce((sum, item) => sum + (item.estimatedDuration || 0), 0);

    const handleSubmit = async () => {
        if (!selectedLocation || !selectedDate || !selectedTime) {
            alert("Please select location, date, and time");
            return;
        }

        const scheduledStart = new Date(`${selectedDate}T${selectedTime}`);

        const bookingData = {
            bookingType: "CustomerBooking" as const,
            shopLocationId: selectedLocation,
            bookingDate: selectedDate,
            bookingTime: selectedTime,
            collectionId: selectedCollection,
            items: selectedItems.map(item => ({ serviceItemId: item.id })),
            notes: notes,
        };

        try {
            await createBooking.mutateAsync(bookingData);
            navigate(`/shops/${shopId}`);
        } catch (error) {
            console.error("Booking failed:", error);
        }
    };

    return (
        <MobileLayout showNav={false}>
            <div className="min-h-screen bg-slate-50 pb-24">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-lg font-semibold">Book Appointment</h1>
                </div>

                <div className="p-4 space-y-6">
                    {/* Selected Services Summary */}
                    <Card>
                        <CardContent className="p-4">
                            <h2 className="font-semibold mb-2">Selected Services</h2>
                            {selectedItems.length > 0 ? (
                                <div>
                                    {selectedItems.map((item) => (
                                        <div key={item.id} className="flex justify-between py-2 border-b">
                                            <span>{item.name}</span>
                                            <span>{item.price.toLocaleString()} VND</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between font-bold pt-2">
                                        <span>Total</span>
                                        <span>{totalPrice.toLocaleString()} VND</span>
                                    </div>
                                    <div className="text-sm text-muted-foreground pt-1">
                                        Duration: {totalDuration} minutes
                                    </div>
                                </div>
                            ) : selectedCollection ? (
                                <p>Collection selected</p>
                            ) : (
                                <p className="text-muted-foreground">No services selected</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Step 1: Select Location */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="w-5 h-5 text-primary" />
                                <h2 className="font-semibold">Select Location</h2>
                            </div>

                            {locationsLoading ? (
                                <div className="flex justify-center py-4">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                </div>
                            ) : (
                                <LocationSelector
                                    locations={locations}
                                    selectedLocation={selectedLocation}
                                    onSelectLocation={setSelectedLocation}
                                />
                            )}
                        </CardContent>
                    </Card>

                    {/* Step 2: Select Date */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Calendar className="w-5 h-5 text-primary" />
                                <h2 className="font-semibold">Select Date</h2>
                            </div>

                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full p-3 border rounded-lg"
                            />
                        </CardContent>
                    </Card>

                    {/* Step 3: Select Time */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Clock className="w-5 h-5 text-primary" />
                                <h2 className="font-semibold">Select Time</h2>
                            </div>

                            <input
                                type="time"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="w-full p-3 border rounded-lg"
                            />
                        </CardContent>
                    </Card>

                    {/* Step 4: Notes (Optional) */}
                    <Card>
                        <CardContent className="p-4">
                            <h2 className="font-semibold mb-4">Additional Notes</h2>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Any special requests or notes..."
                                className="w-full p-3 border rounded-lg min-h-[100px]"
                            />
                        </CardContent>
                    </Card>

                    {/* Existing Bookings (For Debugging) */}
                    {selectedLocation && selectedDate && (
                        <Card>
                            <CardContent className="p-4">
                                <h2 className="font-semibold mb-4">Existing Bookings (Debug)</h2>
                                {bookingsLoading ? (
                                    <div className="flex justify-center py-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    </div>
                                ) : bookings.length > 0 ? (
                                    <div className="space-y-2">
                                        {bookings.map((booking) => (
                                            <div key={booking.id} className="p-3 border rounded">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">{booking.customerName}</span>
                                                    <span className={`text-sm ${booking.status === "Approved" ? "text-green-600" :
                                                            booking.status === "Pending" ? "text-yellow-600" :
                                                                "text-gray-600"
                                                        }`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {new Date(booking.scheduledStart).toLocaleTimeString()} -
                                                    {new Date(booking.scheduledEnd).toLocaleTimeString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">No bookings for this date</p>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
                    <Button
                        onClick={handleSubmit}
                        disabled={createBooking.isPending || !selectedLocation || !selectedDate || !selectedTime}
                        className="w-full h-12 text-lg"
                    >
                        {createBooking.isPending ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                Processing...
                            </>
                        ) : (
                            `Book Now - ${totalPrice.toLocaleString()} VND`
                        )}
                    </Button>
                </div>
            </div>
        </MobileLayout>
    );
};

export default CustomerBookingPage;