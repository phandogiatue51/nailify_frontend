import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useLocationsByShop } from "@/hooks/useLocation";
import { useBookings } from "@/hooks/useBookings";
import { useCustomerArtistById } from "@/hooks/useCustomer";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowLeft, Calendar, Clock, MapPin, User } from "lucide-react";
import { LocationSelector } from "@/components/shop/LocationSelector";

const BookingPage = () => {
  const { shopId, artistId } = useParams<{ shopId?: string; artistId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const locationState = useLocation();

  const isArtistBooking = !!artistId || searchParams.get("type") === "artist";
  const isShopBooking = !!shopId || searchParams.get("type") === "shop";

  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerAddress, setCustomerAddress] = useState<string>("");

  const { data: locations = [], isLoading: locationsLoading } = useLocationsByShop(shopId);
  const { data: artist, isLoading: artistLoading } = useCustomerArtistById(
    isArtistBooking ? artistId : undefined
  );

  const { data: bookings = [], isLoading: bookingsLoading } = isArtistBooking
    ? useBookings().useArtistBookings(artistId, selectedDate ? new Date(selectedDate) : undefined)
    : useBookings().useLocationBookings(selectedLocation, selectedDate ? new Date(selectedDate) : undefined);

  const selectedItems = locationState.state?.selectedItems || [];
  const selectedCollection = locationState.state?.selectedCollection;

  const { createBooking } = useBookings();

  useEffect(() => {
    if (isShopBooking && locations.length > 0 && !selectedLocation) {
      setSelectedLocation(locations[0].shopLocationId);
    }
  }, [locations, selectedLocation, isShopBooking]);

  const totalPrice = selectedItems.reduce((sum, item) => sum + Number(item.price), 0);
  const totalDuration = selectedItems.reduce((sum, item) => sum + (item.estimatedDuration || 0), 0);

  const handleSubmit = async () => {
    if (isShopBooking && !selectedLocation) {
      alert("Please select a location");
      return;
    }

    if (!selectedDate || !selectedTime) {
      alert("Please select date and time");
      return;
    }

    if (isArtistBooking && (!customerName || !customerPhone)) {
      alert("Please provide your name and phone number for artist booking");
      return;
    }

    const scheduledStart = new Date(`${selectedDate}T${selectedTime}`);

    if (isArtistBooking) {
      const bookingData = {
        bookingType: "ArtistBooking" as const,
        nailArtistId: artistId,
        bookingDate: selectedDate,
        bookingTime: selectedTime,
        collectionId: selectedCollection,
        items: selectedItems.map(item => ({ serviceItemId: item.id })),
        notes: notes,
        customerName: customerName,
        customerPhone: customerPhone,
        customerAddress: customerAddress,
      };

      try {
        await createBooking.mutateAsync(bookingData);
        navigate(`/artists/${artistId}`);
      } catch (error) {
        console.error("Artist booking failed:", error);
      }
    } else {
      const bookingData = {
        bookingType: "CustomerBooking" as const,
        shopLocationId: selectedLocation!,
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
        console.error("Shop booking failed:", error);
      }
    }
  };

  const isLoading = locationsLoading || artistLoading;

  return (
    <MobileLayout showNav={false}>
      <div className="min-h-screen bg-slate-50 pb-24">
        <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">
            {isArtistBooking ? "Book with Artist" : "Book Appointment"}
          </h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {isArtistBooking && artist && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {artist.profile?.avatarUrl && (
                      <img
                        src={artist.profile.avatarUrl}
                        className="w-12 h-12 rounded-full"
                        alt={artist.profile.fullName}
                      />
                    )}
                    <div>
                      <h2 className="font-semibold">{artist.profile?.fullName}</h2>
                      <p className="text-sm text-muted-foreground">Nail Artist</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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

            {isShopBooking && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h2 className="font-semibold">Select Location</h2>
                  </div>

                  {locations.length === 0 ? (
                    <p className="text-muted-foreground">No locations available</p>
                  ) : (
                    <LocationSelector
                      locations={locations}
                      selectedLocation={selectedLocation}
                      onSelectLocation={setSelectedLocation}
                    />
                  )}
                </CardContent>
              </Card>
            )}

            {isArtistBooking && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-primary" />
                    <h2 className="font-semibold">Your Information</h2>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full p-3 border rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        className="w-full p-3 border rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Address (Optional)</label>
                      <textarea
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="Where would you like the service?"
                        className="w-full p-3 border rounded-lg min-h-[80px]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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

            {(selectedLocation || artistId) && selectedDate && (
              <Card>
                <CardContent className="p-4">
                  <h2 className="font-semibold mb-4">Existing Bookings</h2>
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
        )}

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <Button
            onClick={handleSubmit}
            disabled={
              createBooking.isPending ||
              !selectedDate ||
              !selectedTime ||
              (isShopBooking && !selectedLocation) ||
              (isArtistBooking && (!customerName || !customerPhone))
            }
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

export default BookingPage;