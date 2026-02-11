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
const DateTimeSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    selectedItems,
    selectedCollection,
    shopId,
    artistId,
    selectedLocation,
    customerName,
    customerPhone,
    customerAddress,
    notes,
  } = location.state || {};

  const isArtistBooking = !!artistId;

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const { user } = useAuth();

  const isShopOwner = user?.role === 1 || user?.role === 3 || user?.role === 4;

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
        artistId,
        selectedLocation,
        selectedDate,
        selectedTime,
        customerName,
        customerPhone,
        customerAddress,
        notes,
      },
    });
  };

  const isSlotBusy = (slotTimeStr: string, bookings: any[]) => {
    return bookings.some((booking) => {
      const start = new Date(booking.scheduledStart);
      const end = new Date(start.getTime() + booking.durationMinutes * 60000);

      const [hours, minutes] = slotTimeStr.split(":");
      const slotDate = new Date(start);
      slotDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      return slotDate >= start && slotDate < end;
    });
  };

  const [selectedDateObj, setSelectedDateObj] = useState<Date>(new Date());

  useEffect(() => {
    setSelectedDate(format(selectedDateObj, "yyyy-MM-dd"));
  }, [selectedDateObj]);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-black tracking-tight uppercase text-lg text-xl bg-gradient-to-r from-[#f988b3] to-[#FFC988] bg-clip-text text-transparent">
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
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Clock className="w-5 h-5 text-[#E288F9]" />
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
                        "py-3 rounded-2xl text-xs font-black transition-all border-2",
                        isSelected
                          ? "bg-[#E288F9] border-[#E288F9] text-white shadow-lg shadow-purple-100 scale-95"
                          : busy
                            ? "bg-slate-50 border-transparent text-slate-300 cursor-not-allowed"
                            : "bg-white border-slate-50 text-slate-600 hover:border-slate-100 active:bg-slate-50",
                      )}
                    >
                      {slot}
                      {busy && isShopOwner && (
                        <div className="text-[8px] text-amber-600 opacity-70">
                          Conflict
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedDate && (selectedLocation || artistId) && (
          <ExistingBookings
            bookings={bookings}
            isLoading={bookingsLoading}
            isShopOwner={isShopOwner}
          />
        )}
      </div>

      <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-4 text-center">
        <Button
          onClick={handleNext}
          disabled={!selectedDate || !selectedTime}
          className="font-black tracking-tight uppercase text-lg"
          style={{
            background: "linear-gradient(90deg, #FFC988 0%, #f988b3 100%)",
            border: "none",
          }}
        >
          Next: Review Booking
        </Button>
      </div>
    </div>
  );
};

export default DateTimeSelection;
