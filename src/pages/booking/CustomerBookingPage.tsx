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
import { AddOnsDrawer } from "@/components/booking/AddOnsDrawer";
import { ServiceItem } from "@/types/database";

const CustomerBookingPage = () => {
  const { shopId: paramShopId, artistId: paramArtistId } = useParams<{
    shopId?: string;
    artistId?: string;
  }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const locationState = useLocation();

  const shopId = locationState.state?.shopId || paramShopId;
  const nailArtistId = locationState.state?.nailArtistId || paramArtistId;

  const isArtistBooking =
    !!nailArtistId || searchParams.get("type") === "artist";
  const isShopBooking = !!shopId || searchParams.get("type") === "shop";

  const STORAGE_KEY = "nailify_booking_state";

  const savedState = ((): any => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  })();

  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [notes] = useState<string>("");
  const { data: locations = [], isLoading: locationsLoading } =
    useLocationsByShop(shopId);

  const customerProfileId =
    locationState.state?.customerProfileId || savedState.customerProfileId || null;
  const customerName =
    locationState.state?.customerName || savedState.customerName || "";
  const customerPhone =
    locationState.state?.customerPhone || savedState.customerPhone || "";
  const customerAddress =
    locationState.state?.customerAddress || savedState.customerAddress || "";

  // Initialize selectedItems from location state or session storage
  const [selectedItems, setSelectedItems] = useState<ServiceItem[]>(
    locationState.state?.selectedItems || savedState.selectedItems || []
  );
  const [selectedCollection, setSelectedCollection] = useState<any>(
    locationState.state?.selectedCollection || savedState.selectedCollection || null
  );

  // Update state when location state changes (when coming back from next step)
  useEffect(() => {
    if (locationState.state) {
      if (locationState.state.selectedItems) {
        setSelectedItems(locationState.state.selectedItems);
      }
      if (locationState.state.selectedCollection) {
        setSelectedCollection(locationState.state.selectedCollection);
      }
    }
  }, [locationState.state]);

  // Persist service-selection state for robust navigation flow
  useEffect(() => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        selectedItems,
        selectedCollection,
        shopId,
        nailArtistId,
        selectedLocation,
        customerProfileId,
        customerName,
        customerPhone,
        customerAddress,
        notes,
      }),
    );
  }, [
    selectedItems,
    selectedCollection,
    shopId,
    nailArtistId,
    selectedLocation,
    customerProfileId,
    customerName,
    customerPhone,
    customerAddress,
    notes,
  ]);

  // Auto-select first location for shop bookings
  useEffect(() => {
    if (isShopBooking && locations.length > 0 && !selectedLocation) {
      setSelectedLocation(locations[0].shopLocationId);
    }
  }, [locations, selectedLocation, isShopBooking]);

  const handleNext = () => {
    if (isShopBooking && !selectedLocation) {
      alert("Vui lòng chọn địa điểm");
      return;
    }

    navigate("/booking/date-time-selection", {
      state: {
        selectedItems,
        selectedCollection,
        shopId,
        nailArtistId,
        selectedLocation,
        notes,
        customerName,
        customerPhone,
        customerAddress,
        customerProfileId,
      },
    });
  };

  const isLoading = locationsLoading;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
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
          {isArtistBooking ? "Đặt lịch với thợ Nail" : "Đặt lịch với cửa hàng"}
        </h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#E288F9]" />
        </div>
      ) : (
        <div className="p-4 space-y-6 pb-24">
          {/* Location Step (Shop only) */}
          {isShopBooking && (
            <LocationStep
              locations={locations}
              selectedLocation={selectedLocation}
              onSelectLocation={setSelectedLocation}
              isLoading={locationsLoading}
            />
          )}

          {/* Service Summary - Always show */}
          {((isShopBooking && selectedLocation) || isArtistBooking) && (
            <div className="space-y-4">
              <ServiceSummary
                selectedItems={selectedItems}
                selectedCollection={selectedCollection}
                shopLocationId={selectedLocation}
                nailArtistId={nailArtistId}
              />

              {/* Add Ons Drawer - Always show */}
              <AddOnsDrawer
                shopId={shopId}
                nailArtistId={nailArtistId}
                selectedItems={selectedItems}
                onAddItems={setSelectedItems}
              />
            </div>
          )}

          {/* Next Button */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg pb-20">
            <Button
              onClick={handleNext}
              disabled={isShopBooking && !selectedLocation}
              className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
                border: "none",
              }}
            >
              Tiếp theo: Chọn ngày & giờ
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerBookingPage;