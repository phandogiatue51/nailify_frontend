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
  CircleDollarSign,
  Flower,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { artistAPI } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

const ConfirmBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    selectedItems = [],
    selectedCollection,
    artistId,
    selectedLocation,
    selectedDate,
    selectedTime,
    customerName,
    customerPhone,
    customerAddress,
    notes,
  } = location.state || {};

  const isArtistBooking = !!artistId;

  const { data: artist, isLoading } = useQuery({
    queryKey: ["artist", artistId],
    queryFn: () => artistAPI.getById(artistId),
    enabled: !!artistId,
  });

  const { data: selectedLocationObj } = useShopOwnerLocationById(
    !isArtistBooking ? selectedLocation : undefined,
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
      bookingType: "CustomerBooking",
    };

    if (artistId) {
      bookingData.nailArtistId = artistId;
      bookingData.customerName = customerName;
      bookingData.customerPhone = customerPhone;
      bookingData.customerAddress = customerAddress || null;
    } else if (selectedLocation) {
      bookingData.shopLocationId = selectedLocation;
    }

    try {
      const createdBooking = await createBooking.mutateAsync(bookingData);

      const bookingId = createdBooking?.bookingId;

      if (!bookingId) {
        console.error("No bookingId in response:", createdBooking);
        alert("Booking created but no ID returned");
        return;
      }
      navigate(`/booking/detail/${bookingId}`);
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1
          className="font-black tracking-tight uppercase text-xl bg-clip-text text-transparent pb-1"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
            WebkitBackgroundClip: "text",
          }}
        >
          Review & Confirm Booking
        </h1>
      </div>

      <div className="p-4 space-y-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-primary" />
              <h2 className="font-black uppercase tracking-tight">
                Selected Services
              </h2>
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
              <h2 className="font-black uppercase tracking-tight">
                Date & Time
              </h2>
            </div>
            <div className="space-y-2 font-medium text-slate-900 tracking-tighter text-md">
              <div className="flex justify-between">
                <p>Date:</p>
                <span>{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span>{selectedTime}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              {isArtistBooking ? (
                <Flower className="w-5 h-5 text-primary" />
              ) : (
                <MapPin className="w-5 h-5 text-primary" />
              )}
              <h2 className="text-md font-black uppercase tracking-tight">
                {isArtistBooking ? "Artist Info" : "Studio Location"}
              </h2>
            </div>

            {isArtistBooking ? (
              <div className="flex items-start gap-4">
                <div>
                  <p className="font-black text-slate-900 uppercase tracking-tighter text-lg">
                    {artist?.fullName ?? "Unknown Artist"}
                  </p>
                  <p className="text-sm font-bold text-slate-400 flex items-center gap-1 mt-1">
                    {artist?.phone ?? "No phone available"}
                  </p>
                </div>
              </div>
            ) : selectedLocationObj ? (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase">
                    {selectedLocationObj.shopName}
                  </h2>
                  <div className="flex items-start gap-2 mt-2 text-slate-500">
                    <p className="text-sm font-medium leading-tight">
                      {selectedLocationObj.address}, {selectedLocationObj.city}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">
                      Opens
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {selectedLocationObj.openingTime}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">
                      Closes
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {selectedLocationObj.closingTime}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {isArtistBooking && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-primary" />
                <h2 className="text-md font-black uppercase tracking-tight">
                  Your Infomation
                </h2>
              </div>
              <div className="flex items-start gap-4">
                <div>
                  <p className="font-black text-slate-900 uppercase tracking-tighter text-lg">
                    {customerName ?? "Unknown Customer"}
                  </p>
                  <p className="text-sm font-bold text-slate-400 flex items-center gap-1 mt-1">
                    {customerPhone ?? "No phone available"}
                  </p>
                  <p className="text-sm font-bold text-slate-400 flex items-center gap-1 mt-1">
                    {customerAddress ?? "No address available"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        {notes && (
          <Card>
            <CardContent className="p-4">
              <h2 className="font-black uppercase tracking-tight">
                Additional Notes
              </h2>
              <p className="text-muted-foreground">{notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Price Summary */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <CircleDollarSign className="w-5 h-5 text-primary" />

              <h2 className="font-black uppercase tracking-tight ">
                Price Summary
              </h2>
            </div>
            <div className="space-y-3 font-medium text-slate-900 tracking-tighter text-md">
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

      <div className="sticky bottom-0 left-0 right-0 p-4 text-center">
        <Button
          onClick={handleConfirm}
          disabled={createBooking.isPending}
          className="font-black tracking-tight uppercase text-lg rounded-[2rem] w-full h-12"
          style={{
            background:
              "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
            border: "none",
          }}
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
