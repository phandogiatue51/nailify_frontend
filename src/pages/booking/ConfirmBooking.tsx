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
import { artistAPI, profileAPI } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { ServiceSummary } from "@/components/booking/ServiceSummary";
import { ProviderInfoCard } from "@/components/booking/ProviderInfoCard";
import { CustomerInfoCard } from "@/components/booking/CustomerInfoCard";
import { useEffect } from "react";

const ConfirmBooking = () => {
  const STORAGE_KEY = "nailify_booking_state";
  const location = useLocation();
  const navigate = useNavigate();

  const persistedBooking = ((): any => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  })();

  const {
    selectedItems = [],
    selectedCollection,
    nailArtistId,
    selectedLocation,
    selectedDate,
    selectedTime,
    customerProfileId,
    customerName,
    customerPhone,
    customerAddress,
    notes,
  } = location.state || persistedBooking || {};

  useEffect(() => {
    if (
      !selectedDate ||
      !selectedTime ||
      (selectedItems.length === 0 && !selectedCollection)
    ) {
      console.warn(
        "Incomplete booking state on ConfirmBooking, redirecting to customer-book",
      );
      navigate("/customer-book", { state: persistedBooking });
    }
  }, [
    selectedDate,
    selectedTime,
    selectedItems.length,
    selectedCollection,
    navigate,
    persistedBooking,
  ]);

  const { user } = useAuth();
  const isArtistBooking = !!nailArtistId;
  const isCustomer = user?.role === 2;

  const { data: artist, isLoading: artistLoading } = useQuery({
    queryKey: ["artist", nailArtistId],
    queryFn: () => artistAPI.getById(nailArtistId),
    enabled: !!nailArtistId,
  });

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", customerProfileId],
    queryFn: () => profileAPI.getById(customerProfileId),
    enabled: !!customerProfileId,
  });

  const { data: selectedLocationObj, isLoading: locationLoading } =
    useShopOwnerLocationById(!isArtistBooking ? selectedLocation : undefined);

  // Determine if we're still loading data
  const isLoading =
    (isArtistBooking && artistLoading) ||
    (!!customerProfileId && profileLoading) ||
    (!isArtistBooking && !!selectedLocation && locationLoading);

  console.log("ConfirmBooking state:", {
    customerProfileId,
    customerName,
    customerPhone,
    profile: profile?.fullName,
  });

  const calculatedPrice = (selectedCollection?.totalPrice || 0) +
    selectedItems.reduce((sum, item) => sum + Number(item.price), 0);

  const calculatedDuration = (selectedCollection?.estimatedDuration || selectedCollection?.calculatedDuration || 0) +
    selectedItems.reduce((sum, item) => sum + (item.estimatedDuration || 0), 0);

  const { createBooking } = useBookings();

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Hãy quay lại trang trước và chọn ngày giờ");
      return;
    }

    const items = selectedItems.map((item: any) => ({
      serviceItemId: item.id,
    }));

    let bookingType;

    if (user?.role === 0) {
      bookingType = "CustomerBooking";
    } else if (user?.role === 1 || user?.role === 3) {
      bookingType = "ShopBooking";
    } else if (user?.role === 4) {
      bookingType = "ArtistBooking";
    }

    const bookingData: any = {
      bookingDate: selectedDate,
      bookingTime: selectedTime,
      collectionId: selectedCollection?.id || null,
      items: items,
      notes: notes,
      bookingType: bookingType,
      customerName: customerName,
      customerPhone: customerPhone,
      customerId: customerProfileId || null,
    };

    if (nailArtistId) {
      bookingData.nailArtistId = nailArtistId;
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

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
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
            Kiểm Tra & Xác Nhận Lịch Hẹn
          </h1>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          </div>
        </div>
      </div>
    );
  }

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
          Kiểm Tra & Xác Nhận Lịch Hẹn
        </h1>
      </div>

      <div className="p-4 space-y-6">
        <ServiceSummary
          selectedItems={selectedItems}
          selectedCollection={selectedCollection}
          shopLocationId={selectedLocation}
          nailArtistId={nailArtistId}
        />

        {/* Date & Time */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="font-black uppercase tracking-tight">
                Ngày & Giờ
              </h2>
            </div>
            <div className="space-y-2 tracking-tighter text-md font-bold text-slate-500">
              <div className="flex justify-between">
                <p>Ngày:</p>
                <span>{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Giờ:</span>
                <span>{selectedTime}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <ProviderInfoCard
          isArtistBooking={isArtistBooking}
          artist={artist}
          locationObj={selectedLocationObj}
        />

        {/* Customer Info */}
        <CustomerInfoCard
          isCustomer={isCustomer}
          profile={profile}
          customerName={customerName}
          customerPhone={customerPhone}
          customerAddress={customerAddress}
        />

        {/* Notes */}
        {notes && (
          <Card>
            <CardContent className="p-4">
              <h2 className="font-black uppercase tracking-tight">Ghi chú</h2>
              <p className="text-muted-foreground">{notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Price Summary */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <CircleDollarSign className="w-5 h-5 text-primary" />
              <h2 className="font-black uppercase tracking-tight">Tổng quan</h2>
            </div>
            <div className="space-y-3  tracking-tighter text-md  font-bold text-slate-500">
              <div className="flex justify-between items-center">
                <span>Tổng giá tiền:</span>
                <span className="text-2xl font-bold text-green-600">
                  {calculatedPrice.toLocaleString()} đ
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Thời gian dự kiến:</span>
                <span>{calculatedDuration} phút</span>
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
            </>
          ) : (
            <>
              <Check className="w-5 h-5 mr-2" />
              Xác nhận đặt lịch
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmBooking;
