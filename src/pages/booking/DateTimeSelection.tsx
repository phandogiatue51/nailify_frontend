import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useBookings } from "@/hooks/useBookings";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ExistingBookings } from "@/components/booking/ExistingBookings";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { TIME_SLOTS } from "./TimeSlot";
import { format } from "date-fns";
import { DateScrollPicker } from "@/components/booking/DateScrollPickerProps";
import { useShopOwnerLocationById } from "@/hooks/useLocation";
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

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const { user } = useAuth();

  const isShopOwner = user?.role !== 0;

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  const { data: bookings = [], isLoading: bookingsLoading } = isArtistBooking
    ? useBookings().useArtistBookings(
      selectedDate ? new Date(selectedDate) : undefined,
    )
    : useBookings().useLocationBookings(
      selectedLocation,
      selectedDate ? new Date(selectedDate) : undefined,
    );

  const handleNext = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select date and time");
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

  const { data: locationSettings } = useShopOwnerLocationById(selectedLocation);

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

  const [selectedDateObj, setSelectedDateObj] = useState<Date>(new Date());

  useEffect(() => {
    setSelectedDate(format(selectedDateObj, "yyyy-MM-dd"));
  }, [selectedDateObj]);

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
          Select Date & Time
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
                    Select Time Slot
                  </h2>
                </div>
                {!isShopOwner && (
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">
                    Local Time
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const busy = isSlotBusy(slot, bookings);
                  const isSelected = selectedTime === slot;

                  return (
                    <button
                      key={slot}
                      disabled={busy && !isShopOwner}
                      onClick={() => setSelectedTime(slot)}
                      className={cn(
                        "relative py-4 rounded-2xl text-xs font-black transition-all flex flex-col items-center justify-center",
                        isSelected
                          ? "bg-gradient-to-r from-[#950101] to-[#ffcfe9] text-white scale-95"
                          : busy
                            ? "bg-slate-50 border-transparent text-slate-200 cursor-not-allowed"
                            : "bg-white border-slate-50 text-slate-600 hover:border-slate-200",
                      )}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {isShopOwner && (
          <div className="mt-4">
            <h3 className="text-xs font-black uppercase text-slate-400 mb-2 px-2">
              Existing Bookings
            </h3>
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
          Next: Review Booking
        </Button>
      </div>
    </div>
  );
};

export default DateTimeSelection;
