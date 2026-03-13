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

const ConfirmBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
  } = location.state || {};

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
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-primary" />
              <h2 className="font-black uppercase tracking-tight">
                Dịch vụ đã chọn
              </h2>
            </div>

            {selectedCollection ? (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    {selectedCollection.imageUrl ? (
                      <img
                        src={selectedCollection.imageUrl}
                        alt={selectedCollection.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg object-cover bg-gradient-to-br from-[#950101] to-[#FFCFE9] flex items-center justify-center">
                        <span className="text-xl font-bold text-white uppercase">
                          {selectedCollection.name?.[0] || "U"}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">
                        {selectedCollection.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">Set Nail</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedItems.length > 0 ? (
              <div className="space-y-2">
                {selectedItems.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex justify-between py-2 border-b text-md font-bold text-slate-500"
                  >
                    <span>{item.name}</span>
                    <span>{item.price?.toLocaleString()} đ</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Không có dịch vụ</p>
            )}
          </CardContent>
        </Card>

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

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              {isArtistBooking ? (
                <Flower className="w-5 h-5 text-primary" />
              ) : (
                <MapPin className="w-5 h-5 text-primary" />
              )}
              <h2 className="text-md font-black uppercase tracking-tight">
                {isArtistBooking ? "Thông tin thợ Nail" : "Thông tin cửa hàng"}
              </h2>
            </div>

            {isArtistBooking ? (
              <div className="flex items-start gap-4">
                <div>
                  <p className="font-black text-slate-900 uppercase tracking-tighter text-lg">
                    {artist?.fullName}
                  </p>
                  <p className="text-sm font-bold text-slate-400 flex items-center gap-1 mt-1">
                    {artist?.phone ?? "Không có số điện thoại"}
                  </p>
                </div>
              </div>
            ) : selectedLocationObj ? (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase">
                    {selectedLocationObj.shopName}
                  </h2>
                  <div className="flex items-start gap-2 mt-2">
                    <p className="text-md font-bold text-slate-500">
                      {selectedLocationObj.address}, {selectedLocationObj.city}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 text-center">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-sm font-black uppercase text-slate-400 mb-1">
                      Mở cửa
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {selectedLocationObj.openingTime}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-sm font-black uppercase text-slate-400 mb-1">
                      Đóng cửa
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

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-md font-black uppercase tracking-tight">
                {isCustomer ? "Thông tin của bạn" : "Thông tin khách hàng"}
              </h2>
            </div>
            <div className="flex items-start gap-4">
              <div>
                <p className="font-black text-slate-900 uppercase tracking-tighter text-lg">
                  {profile?.fullName || customerName}
                </p>
                <p className="text-sm font-bold text-slate-400 flex items-center gap-1 mt-1">
                  {profile?.phone || customerPhone || ""}
                </p>
                <p className="text-sm font-bold text-slate-400 flex items-center gap-1 mt-1">
                  {profile?.address || customerAddress || ""}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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
