import React, { useState, useMemo } from "react";
import {
  format,
  addDays,
  startOfWeek,
  isSameDay,
  eachDayOfInterval,
} from "date-fns";
import { cn } from "@/lib/utils";
import { Booking } from "@/types/database";
import BookingCard from "./BookingCard";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";

interface BookingCalendarViewProps {
  bookings: Booking[];
  role: "customer" | "nailArtist" | "shop" | "staff";
  onApprove?: (bookingId: string) => void;
  onReject?: (bookingId: string) => void;
  onCancel?: (bookingId: string) => void;
  onComplete?: (bookingId: string) => void;
  isLoading?: boolean;
  updatingBookingId?: string | null;
}

const BookingCalendarView: React.FC<BookingCalendarViewProps> = ({
  bookings,
  role,
  onApprove,
  onReject,
  onCancel,
  onComplete,
  isLoading = false,
  updatingBookingId = null,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    return eachDayOfInterval({
      start: start,
      end: addDays(start, 6),
    });
  }, [selectedDate]);

  const dailyBookings = bookings
    .filter((b) => isSameDay(new Date(b.scheduledStart), selectedDate))
    .sort(
      (a, b) =>
        new Date(a.scheduledStart).getTime() -
        new Date(b.scheduledStart).getTime(),
    );

  return (
    <div className="flex flex-col h-full bg-[#FDFCFD]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Schedule
          </h3>
          <h2 className="text-2xl font-black text-slate-900">
            {format(selectedDate, "MMMM yyyy")}
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedDate(addDays(selectedDate, -7))}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSelectedDate(addDays(selectedDate, 7))}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex px-1 py-3">
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          return (
            <button
              key={day.toString()}
              onClick={() => setSelectedDate(day)}
              className={cn(
                "flex flex-col items-center min-w-[55px] py-4 rounded-[2rem] transition-all duration-300",
                isSelected
                  ? "bg-[#E288F9] text-white shadow-xl shadow-purple-200 scale-110"
                  : "bg-white text-slate-400 border border-slate-50",
              )}
            >
              <span className="text-[10px] font-bold uppercase mb-1">
                {format(day, "EEE")}
              </span>
              <span className="text-lg font-black">{format(day, "d")}</span>
              {bookings.some((b) =>
                isSameDay(new Date(b.scheduledStart), day),
              ) && (
                <div
                  className={cn(
                    "w-1 h-1 rounded-full mt-1",
                    isSelected ? "bg-white" : "bg-[#E288F9]",
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex-1 space-y-4 mt-4">
        <div className="flex items-center gap-2 mb-2">
          <CalendarIcon className="w-4 h-4 text-[#FFC988]" />
          <span className="text-[12px] font-black uppercase tracking-widest text-slate-500">
            {format(selectedDate, "eeee, MMM do")}
          </span>
        </div>

        {dailyBookings.length > 0 ? (
          <div className="relative border-l-2 border-dashed border-slate-100 pl-6 space-y-6">
            {dailyBookings.map((booking) => (
              <div key={booking.id} className="relative">
                <div className="absolute -left-[31px] top-4 w-4 h-4 rounded-full border-4 border-[#FDFCFD] bg-[#E288F9]" />

                <div className="text-[10px] font-black text-slate-400 uppercase mb-2">
                  {format(new Date(booking.scheduledStart), "p")}
                </div>

                <BookingCard
                  booking={booking}
                  isShopOwner={role === "shop" || role === "staff"}
                  onApprove={onApprove}
                  onReject={onReject}
                  onCancel={onCancel}
                  onComplete={onComplete}
                  isLoading={updatingBookingId === booking.id && isLoading}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
              <CalendarIcon className="w-6 h-6 text-slate-200" />
            </div>
            <p className="text-sm font-bold text-slate-400">
              No appointments scheduled
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCalendarView;
