import { useState, useEffect } from "react";
import {
  useParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useLocationsByShop } from "@/hooks/useLocation";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";

import { ServiceSummary } from "@/components/booking/ServiceSummary";
import { LocationStep } from "@/components/booking/LocationStep";

const CustomerBookingPage = () => {
  const { shopId: paramShopId, artistId: paramArtistId } = useParams<{
    shopId?: string;
    artistId?: string;
  }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const locationState = useLocation();

  const shopId = locationState.state?.shopId || paramShopId;
  const artistId = locationState.state?.id || paramArtistId;

  const isArtistBooking = !!artistId || searchParams.get("type") === "artist";
  const isShopBooking = !!shopId || searchParams.get("type") === "shop";

  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [notes] = useState<string>("");
  const [customerName] = useState<string>("");
  const [customerPhone] = useState<string>("");
  const [customerAddress] = useState<string>("");

  const { data: locations = [], isLoading: locationsLoading } =
    useLocationsByShop(shopId);

  const selectedItems = locationState.state?.selectedItems || [];
  const selectedCollection = locationState.state?.selectedCollection;

  useEffect(() => {
    if (isShopBooking && locations.length > 0 && !selectedLocation) {
      setSelectedLocation(locations[0].shopLocationId);
    }
  }, [locations, selectedLocation, isShopBooking]);
  const handleNext = () => {
    if (isShopBooking && !selectedLocation) {
      alert("Please select a location");
      return;
    }

    if (isArtistBooking && (!customerName || !customerPhone)) {
      alert("Please provide your name and phone number");
      return;
    }

    navigate("/booking/date-time-selection", {
      state: {
        selectedItems,
        selectedCollection,
        shopId,
        artistId,
        selectedLocation,
        ...(isArtistBooking && {
          customerName,
          customerPhone,
          customerAddress,
        }),
        notes,
      },
    });
  };

  const isLoading = locationsLoading;
  return (
    <div>
      <div className="min-h-screen bg-slate-50">
        <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-black tracking-tighter uppercase text-xl bg-gradient-to-r from-[#950101] to-[#ffcfe9] bg-clip-text text-transparent">
            {isArtistBooking ? "Book with Artist" : "Book Appointment"}
          </h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {isArtistBooking && (
              <ServiceSummary
                selectedItems={selectedItems}
                selectedCollection={selectedCollection}
                shopLocationId={null}
                nailArtistId={artistId}
              />
            )}

            {isShopBooking && (
              <LocationStep
                locations={locations}
                selectedLocation={selectedLocation}
                onSelectLocation={setSelectedLocation}
                isLoading={locationsLoading}
              />
            )}

            {isShopBooking && selectedLocation && (
              <ServiceSummary
                selectedItems={selectedItems}
                selectedCollection={selectedCollection}
                shopLocationId={selectedLocation}
                nailArtistId={null}
              />
            )}

            <div className="sticky bottom-0 left-0 right-0 p-4 text-center">
              <Button
                onClick={handleNext}
                disabled={
                  (isShopBooking && !selectedLocation) ||
                  (isArtistBooking && (!customerName || !customerPhone))
                }
                style={{
                  background:
                    "linear-gradient(90deg, #950101 0%, #ffcfe9 100%)",
                  border: "none",
                }}
                className="font-black tracking-tight uppercase text-lg rounded-[2rem] w-full h-12"
              >
                Next: Select Date & Time
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerBookingPage;
