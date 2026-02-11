// /src/components/booking/ExistingBookings.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
interface ExistingBookingsProps {
  bookings: any[];
  isLoading: boolean;
  currentBookingId?: string;
  isShopOwner?: boolean;
}

export const ExistingBookings = ({
  bookings,
  isLoading,
  currentBookingId,
  isShopOwner,
}: ExistingBookingsProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <p>Loading existing bookings...</p>
        </CardContent>
      </Card>
    );
  }

  const filteredBookings = currentBookingId
    ? bookings.filter((booking) => booking.id !== currentBookingId)
    : bookings;

  if (filteredBookings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {isShopOwner ? "Schedule Conflict Check" : "Availability Note"}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className={cn(
              "flex items-center justify-between p-3 rounded-2xl border transition-all",
              isShopOwner
                ? "bg-amber-50 border-amber-100"
                : "bg-slate-100 border-transparent opacity-60",
            )}
          >
            <div className="flex items-center gap-3">
              <Clock
                className={cn(
                  "w-4 h-4",
                  isShopOwner ? "text-amber-500" : "text-slate-400",
                )}
              />
              <span className="text-sm font-bold text-slate-700">
                {new Date(booking.scheduledStart).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {isShopOwner ? (
              <div className="text-right">
                <p className="text-[10px] font-black text-amber-700 uppercase leading-none">
                  {booking.customerName || "Busy"}
                </p>
                <p className="text-[9px] font-bold text-amber-600/70">
                  {booking.durationMinutes}m
                </p>
              </div>
            ) : (
              <Badge
                variant="outline"
                className="text-[9px] uppercase border-slate-300 text-slate-500 font-black"
              >
                Slot Taken
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
