import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useBookings } from "@/hooks/useBookings";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ExistingBookings } from "@/components/booking/ExistingBookings";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DateScrollPicker } from "@/components/booking/DateScrollPickerProps";
import { useShopOwnerLocationById } from "@/hooks/useLocation";
import { generateTimeSlots } from "@/components/ui/timeSlots";

const DateTimeSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
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
  } = location.state || {};

  const isArtistBooking = !!nailArtistId;
  const { user } = useAuth();
  const isShopOwner = user?.role !== 0;

  const [selectedDateObj, setSelectedDateObj] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const { data: locationSettings } = useShopOwnerLocationById(selectedLocation);

  // Update selectedDate when selectedDateObj changes
  useEffect(() => {
    setSelectedDate(format(selectedDateObj, "yyyy-MM-dd"));
  }, [selectedDateObj]);

  // Initialize to next available day if store is closed for today
  useEffect(() => {
    if (locationSettings?.closingTime) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      const [closeHour, closeMinute] = locationSettings.closingTime
        .split(":")
        .map(Number);

      if (
        currentHour > closeHour ||
        (currentHour === closeHour && currentMinute >= closeMinute)
      ) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setSelectedDateObj(tomorrow);
      }
    }
  }, [locationSettings?.closingTime]);

  const timeSlots = useMemo(() => {
    return generateTimeSlots({
      openingTime: locationSettings?.openingTime,
      closingTime: locationSettings?.closingTime,
      bufferMinutes: locationSettings?.bufferMinutes,
    });
  }, [
    locationSettings?.openingTime,
    locationSettings?.closingTime,
    locationSettings?.bufferMinutes,
  ]);

  // Fetch bookings
  const { data: bookings = [], isLoading: bookingsLoading } = isArtistBooking
    ? useBookings().useArtistBookings(
        selectedDate ? new Date(selectedDate) : undefined,
      )
    : useBookings().useLocationBookings(
        selectedLocation,
        selectedDate ? new Date(selectedDate) : undefined,
      );

  const calculatedDuration = selectedCollection
    ? selectedCollection.estimatedDuration ||
      selectedCollection.calculatedDuration ||
      0
    : selectedItems.reduce(
        (sum, item) => sum + (item.estimatedDuration || 0),
        0,
      );

  const isSlotBusy = (slotTimeStr: string, bookings: any[]) => {
    const maxCapacity = isArtistBooking
      ? 1
      : locationSettings?.maxConcurrentBookings || 1;
    const buffer = locationSettings?.bufferMinutes || 0;

    const [hours, minutes] = slotTimeStr.split(":").map(Number);
    const slotDate = new Date(selectedDateObj);
    slotDate.setHours(hours, minutes, 0, 0);

    const overlappingCount = bookings.filter((booking) => {
      const start = new Date(booking.scheduledStart);
      const end = new Date(
        start.getTime() + (booking.durationMinutes + buffer) * 60000,
      );

      return slotDate >= start && slotDate < end;
    }).length;

    return overlappingCount >= maxCapacity;
  };

  // Check if slot can complete before closing
  const canCompleteBeforeClose = (slotTimeStr: string) => {
    if (!locationSettings?.closingTime) return true;

    const [slotHour, slotMinute] = slotTimeStr.split(":").map(Number);
    const [closeHour, closeMinute] = locationSettings.closingTime
      .split(":")
      .map(Number);

    const slotStartMinutes = slotHour * 60 + slotMinute;
    const closeMinutes = closeHour * 60 + closeMinute;
    const totalDuration =
      calculatedDuration + (locationSettings?.bufferMinutes || 0);

    return slotStartMinutes + totalDuration <= closeMinutes;
  };

  // Check if slot is in the past (for today only)
  const isSlotInPast = (slotTimeStr: string) => {
    const [hours, minutes] = slotTimeStr.split(":").map(Number);
    const slotDate = new Date(selectedDateObj);
    slotDate.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const isToday =
      format(selectedDateObj, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");

    return isToday && slotDate < now;
  };

  const handleNext = () => {
    if (!selectedDate || !selectedTime) {
      alert("Hãy chọn 1 ngày và giờ");
      return;
    }

    navigate("/booking/confirm-booking", {
      state: {
        selectedItems,
        selectedCollection,
        shopId,
        nailArtistId,
        selectedLocation,
        selectedDate,
        selectedTime,
        customerName,
        customerPhone,
        customerAddress,
        customerProfileId,
        notes,
      },
    });
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
          Chọn ngày và giờ
        </h1>
      </div>

      <div className="p-4 space-y-6">
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
          <CardContent className="p-4">
            <DateScrollPicker
              selectedDate={selectedDateObj}
              onDateChange={setSelectedDateObj}
            />
          </CardContent>
        </Card>

        {selectedDate && (
          <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <Clock className="w-5 h-5 text-[#950101]" />
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-tight">
                    Chọn thời gian
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((slot) => {
                  const busy = isSlotBusy(slot, bookings);
                  const inPast = isSlotInPast(slot);
                  const canComplete = canCompleteBeforeClose(slot);
                  const isSelected = selectedTime === slot;

                  // Disable if busy, in past, or cannot complete before closing (unless shop owner)
                  const disabled =
                    (busy || inPast || !canComplete) && !isShopOwner;

                  return (
                    <button
                      key={slot}
                      disabled={disabled}
                      onClick={() => setSelectedTime(slot)}
                      className={cn(
                        "relative py-4 rounded-2xl text-xs font-black transition-all flex flex-col items-center justify-center",
                        isSelected
                          ? "bg-gradient-to-r from-[#950101] to-[#ffcfe9] text-white scale-95"
                          : busy
                            ? "bg-slate-50 border-transparent text-slate-200 cursor-not-allowed"
                            : inPast
                              ? "bg-slate-50 border-transparent text-slate-200 cursor-not-allowed"
                              : !canComplete
                                ? "bg-slate-50 border-transparent text-slate-200 cursor-not-allowed"
                                : "bg-white border-slate-50 text-slate-600 hover:border-slate-200",
                      )}
                    >
                      {slot}
                      {!canComplete && (
                        <span className="text-[10px]">(đóng cửa)</span>
                      )}
                      {inPast && <span className="text-[10px]">(đã qua)</span>}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {isShopOwner && (
          <div className="mt-4">
            <ExistingBookings
              bookings={bookings}
              isLoading={bookingsLoading}
              isShopOwner={isShopOwner}
            />
          </div>
        )}
      </div>

      <div className="sticky bottom-0 left-0 right-0 p-4 text-center">
        <Button
          onClick={handleNext}
          disabled={!selectedDate || !selectedTime}
          style={{
            background:
              "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
            border: "none",
          }}
          className="font-black tracking-tight uppercase text-lg rounded-[2rem] w-full h-12"
        >
          Tiếp theo: xác nhận lịch hẹn
        </Button>
      </div>
    </div>
  );
};

export default DateTimeSelection;
