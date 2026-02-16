import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBookings } from "@/hooks/useBookings";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, AlertCircle, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TIME_SLOTS } from "./TimeSlot";
import { DateScrollPicker } from "@/components/booking/DateScrollPickerProps";
import { useShopOwnerLocationById } from "@/hooks/useLocation";
import { useAuth } from "@/hooks/use-auth";
import { ExistingBookings } from "@/components/booking/ExistingBookings";

const RescheduleBooking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const {
    useBookingById,
    updateBooking,
    useLocationBookings,
    useArtistBookings,
  } = useBookings();
  const { data: booking, isLoading } = useBookingById(id);
  const updateMutation = updateBooking;
  const isShopOwner = user?.role === 1 || user?.role === 3 || user?.role === 4;

  const [selectedDateObj, setSelectedDateObj] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (booking) {
      const start = new Date(booking.scheduledStart);
      setSelectedDateObj(start);
      setSelectedTime(format(start, "HH:mm"));
    }
  }, [booking]);

  const selectedDateStr = format(selectedDateObj, "yyyy-MM-dd");
  const { data: locationData } = useShopOwnerLocationById(
    booking?.shopLocationId,
  );
  const { data: conflicts = [], isLoading: conflictsLoading } =
    booking?.shopLocationId
      ? useLocationBookings(booking.shopLocationId, selectedDateObj)
      : useArtistBookings(selectedDateObj);

  const maxCapacity = locationData?.maxConcurrentBookings || 1;

  const isSlotBusy = (slotTimeStr: string) => {
    const [hours, minutes] = slotTimeStr.split(":").map(Number);
    const slotStart = new Date(selectedDateObj);
    slotStart.setHours(hours, minutes, 0, 0);

    const buffer = locationData?.bufferMinutes || 0;

    const overlappingBookings = conflicts.filter((b: any) => {
      if (b.id === id) return false;

      const bStart = new Date(b.scheduledStart);
      const bEnd = new Date(
        bStart.getTime() + (b.durationMinutes + buffer) * 60000,
      );

      return slotStart >= bStart && slotStart < bEnd;
    });

    return overlappingBookings.length >= maxCapacity;
  };

  const handleReschedule = async () => {
    if (!selectedTime || !booking) return;

    const newDateTime = new Date(`${selectedDateStr}T${selectedTime}:00`);

    if (newDateTime < new Date()) {
      toast({
        title: "Invalid Time",
        description: "Cannot schedule in the past",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await updateMutation.mutateAsync({
        id: booking.id,
        data: { scheduledStart: newDateTime.toISOString() },
      });
      navigate(`/booking/detail/${booking.id}`, { state: { success: true } });
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center font-black uppercase text-slate-400">
        Loading...
      </div>
    );

  if (!booking)
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center text-center gap-4">
        <AlertCircle className="w-12 h-12 text-rose-400" />
        <h2 className="font-black uppercase tracking-tight text-xl">
          Booking Not Found
        </h2>
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="rounded-2xl"
        >
          Go Back
        </Button>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b px-4 py-4 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-xl"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="font-black tracking-tighter uppercase text-xl bg-gradient-to-r from-[#f988b3] to-[#FFC988] bg-clip-text text-transparent">
            Reschedule
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="rounded-[2rem] p-6 shadow-xl shadow-pink-100 bg-gradient-to-br from-[#f988b3] to-[#FFC988] text-white">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">
            Current Appointment
          </h3>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xl font-black tracking-tighter uppercase">
                {format(new Date(booking.scheduledStart), "MMM do  h:mm a")}
              </p>
              <p className="text-xs font-bold opacity-90 italic">
                {booking.collectionName || "Custom Service"}
              </p>
            </div>
            <Calendar className="w-8 h-8 opacity-20" />
          </div>
        </div>

        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
          <CardContent className="p-4">
            <DateScrollPicker
              selectedDate={selectedDateObj}
              onDateChange={setSelectedDateObj}
            />
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-purple-50 rounded-xl">
                <Clock className="w-5 h-5 text-[#E288F9]" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-tight text-slate-700">
                Select New Time
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => {
                const busy = isSlotBusy(slot);
                const isSelected = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    disabled={busy}
                    onClick={() => setSelectedTime(slot)}
                    className={cn(
                      "relative py-4 rounded-2xl text-xs font-black transition-all flex flex-col items-center justify-center",
                      isSelected
                        ? "bg-gradient-to-r from-[#f988b3] to-[#FFC988] text-white scale-95"
                        : busy
                          ? "bg-slate-50 border-transparent text-slate-200 cursor-not-allowed"
                          : "bg-white border-slate-50 text-slate-600 hover:border-slate-200",
                    )}
                  >
                    {slot}
                    {busy && (
                      <span className="text-[8px] uppercase absolute bottom-1">
                        Busy
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {isShopOwner &&
          selectedDateStr &&
          (booking.shopLocationId || booking.nailArtistId) && (
            <div className="mt-4 px-2">
              <h3 className="text-xs font-black uppercase text-slate-400 mb-4 px-2 flex items-center gap-2">
                <AlertCircle className="w-3 h-3" />
                Existing Bookings
              </h3>
              <ExistingBookings
                bookings={conflicts}
                isLoading={conflictsLoading}
                isShopOwner={isShopOwner}
              />
            </div>
          )}
      </div>

      {/* Action Bar */}
      <div className="sticky bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent z-30">
        <div className="flex gap-3 max-w-md mx-auto">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-xs border-slate-200 text-slate-400"
          >
            Cancel
          </Button>
          <Button
            onClick={handleReschedule}
            disabled={isSubmitting || !selectedTime}
            style={{
              background:
                "linear-gradient(90deg, #950101 0%, #ffcfe9 100%)",
              border: "none",
            }}
            className="flex-[2] h-14 rounded-2xl font-black uppercase tracking-widest text-xs text-white shadow-2xl transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Confirm Reschedule"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleBooking;
