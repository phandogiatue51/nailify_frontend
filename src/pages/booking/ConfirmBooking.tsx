import { useLocation, useNavigate } from "react-router-dom";
import { useBookings } from "@/hooks/useBookings";
import { useShopOwnerLocationById } from "@/hooks/useLocation";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ArrowLeft,
  Check,
  Calendar,
  MapPin,
  User,
  Package,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ConfirmBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    selectedItems = [],
    selectedCollection,
    shopId,
    artistId,
    selectedLocation,
    selectedDate,
    selectedTime,
    customerName = "",
    customerPhone = "",
    customerAddress = "",
    notes = "",
  } = location.state || {};

  const isArtistBooking = !!artistId;

  const { data: selectedLocationObj } = useShopOwnerLocationById(
    !isArtistBooking ? selectedLocation : undefined
  );

  const calculatedPrice = selectedCollection
    ? selectedCollection.totalPrice || 0
    : selectedItems.reduce((sum, item) => sum + Number(item.price), 0);

  const calculatedDuration = selectedCollection
    ? selectedCollection.estimatedDuration ||
    selectedCollection.calculatedDuration ||
    0
    : selectedItems.reduce(
      (sum, item) => sum + (item.estimatedDuration || 0),
      0,
    );


  const { createBooking } = useBookings();

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Please go back and select date and time");
      return;
    }

    const items = selectedItems.map((item: any) => ({
      serviceItemId: item.id,
    }));

    const bookingData: any = {
      bookingDate: selectedDate,
      bookingTime: selectedTime,
      collectionId: selectedCollection?.id || null,
      items: items,
      notes: notes,
    };

    if (isArtistBooking) {
      bookingData.bookingType = "ArtistBooking";
      bookingData.nailArtistId = artistId;
      bookingData.customerName = customerName;
      bookingData.customerPhone = customerPhone;
      bookingData.customerAddress = customerAddress || null;
    } else {
      bookingData.bookingType = "CustomerBooking";
      bookingData.shopLocationId = selectedLocation;
    }

    try {
      createBooking
      const createdBooking = await createBooking.mutateAsync(bookingData);

      navigate(`/booking/detail/${createdBooking.id}`, {
        state: {
          booking: createdBooking,
          type: isArtistBooking ? "artist" : "shop",
          id: isArtistBooking ? artistId : shopId,
          success: true,
        },
      });
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">Review & Confirm Booking</h1>
      </div>

      <div className="p-4 space-y-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Selected Services</h2>
            </div>

            {selectedCollection ? (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    {selectedCollection.imageUrl && (
                      <img
                        src={selectedCollection.imageUrl}
                        alt={selectedCollection.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">
                        {selectedCollection.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Collection
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedItems.length > 0 ? (
              <div className="space-y-2">
                {selectedItems.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex justify-between py-2 border-b"
                  >
                    <span>{item.name}</span>
                    <span>{item.price?.toLocaleString()} VND</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No services selected</p>
            )}
          </CardContent>
        </Card>

        {/* Date & Time */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Date & Time</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              {isArtistBooking ? (
                <User className="w-5 h-5 text-primary" />
              ) : (
                <MapPin className="w-5 h-5 text-primary" />
              )}
              <h2 className="font-semibold">
                {isArtistBooking ? "Artist" : "Location"}
              </h2>
            </div>
            {isArtistBooking ? (
              <div>
                <p className="font-medium">Mobile Service</p>
                {customerAddress && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Service at: {customerAddress}
                  </p>
                )}
              </div>
            ) : selectedLocationObj ? (
              <div className="space-y-4 font-sans">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {selectedLocationObj.shopName}
                </h2>

                <div className="text-sm text-gray-700 leading-relaxed">
                  <p>{selectedLocationObj.address}</p>
                  <p>{selectedLocationObj.city}</p>
                  <p>{selectedLocationObj.phone}</p>
                </div>

                <div className="text-sm text-gray-700">
                  <p>Opens: {selectedLocationObj.openingTime}</p>
                  <p>Closes: {selectedLocationObj.closingTime}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Selected location will be confirmed
              </p>
            )}
          </CardContent>
        </Card>

        {isArtistBooking && (
          <Card>
            <CardContent className="p-4">
              <h2 className="font-semibold mb-4">Your Information</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{customerPhone}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        {notes && (
          <Card>
            <CardContent className="p-4">
              <h2 className="font-semibold mb-2">Additional Notes</h2>
              <p className="text-muted-foreground">{notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Price Summary */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-4">Price Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Total Price:</span>
                <span className="text-2xl font-bold text-green-600">
                  {calculatedPrice.toLocaleString()} VND
                </span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Estimated Duration:</span>
                <span>{calculatedDuration} minutes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-4">
        <Button
          onClick={handleConfirm}
          disabled={createBooking.isPending}
          className="w-full h-12 text-lg"
        >
          {createBooking.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Check className="w-5 h-5 mr-2" />
              Confirm Booking
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmBooking;
