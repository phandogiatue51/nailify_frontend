import { useState, useEffect } from "react";
import { useShopOwnerLocations } from "@/hooks/useLocation";
import { useBookings } from "@/hooks/useBookings";
import BookingCard from "@/components/booking/BookingCard";
import { BookingStatus } from "@/types/database";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, MapPin } from "lucide-react";
import { format, endOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const STATUS_OPTIONS = [
  { label: "All", value: undefined },
  { label: "Pending", value: 0 },
  { label: "Approved", value: 1 },
  { label: "Rejected", value: 2 },
  { label: "Completed", value: 3 },
  { label: "Cancelled", value: 4 },
] as const;

const ShopBookingView: React.FC = () => {
  const [status, setStatus] = useState<BookingStatus | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedLocationId, setSelectedLocationId] = useState<
    string | undefined
  >(undefined);

  const auth = useAuth();
  const { filterBookings, updateBookingStatus } = useBookings();

  const { locations = [], isLoading: isLoadingLocations } =
    useShopOwnerLocations();

  const handleApprove = (bookingId: string) => {
    updateBookingStatus.mutate({ bookingId, status: 1 });
  };

  const handleReject = (bookingId: string) => {
    updateBookingStatus.mutate({ bookingId, status: 2 });
  };

  const handleCancel = (bookingId: string) => {
    updateBookingStatus.mutate({ bookingId, status: 4 });
  };

  const handleComplete = (bookingId: string) => {
    updateBookingStatus.mutate({ bookingId, status: 3 });
  };

  useEffect(() => {
    if (auth.user?.shopId) {
      const dateToSend = date ? endOfDay(date).toISOString() : null;

      filterBookings.mutate({
        ShopId: auth.user.shopId,
        Date: dateToSend,
        Status: status,
        ShopLocationId: selectedLocationId,
      });
    }
  }, [
    status,
    date,
    selectedLocationId,
    auth.user?.shopId,
    filterBookings.mutate,
  ]);

  const { data: bookings, isPending: isLoadingBookings } = filterBookings;

  // Debug log to see what locations we're getting
  useEffect(() => {
    console.log("Locations:", locations);
    console.log("Selected location ID:", selectedLocationId);
  }, [locations, selectedLocationId]);

  return (
    <div className="p-4 space-y-6 bg-slate-50/30 min-h-screen pb-20">
      <div className="sticky top-0 bg-white/90 backdrop-blur-md z-20 pt-2 pb-4 px-4 border-b border-slate-50 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black tracking-tight">Appointments</h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="h-9 rounded-xl bg-slate-50 text-xs font-bold"
              >
                <CalendarIcon className="mr-2 h-3.5 w-3.5 text-[#E288F9]" />
                {date ? format(date, "MMM dd") : "Pick date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-[2rem]">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Location Filter - Only show if locations exist */}
        {locations && locations.length > 0 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
            <button
              onClick={() => setSelectedLocationId(undefined)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5",
                !selectedLocationId
                  ? "bg-[#E288F9] text-white shadow-lg shadow-purple-100"
                  : "bg-slate-50 text-slate-400 hover:bg-slate-100",
              )}
            >
              <MapPin className="h-3 w-3" />
              All Locations
            </button>

            {locations.map((location) => (
              <button
                key={location.shopLocationId || location.id}
                onClick={() =>
                  setSelectedLocationId(location.shopLocationId || location.id)
                }
                className={cn(
                  "whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  selectedLocationId ===
                    (location.shopLocationId || location.id)
                    ? "bg-[#E288F9] text-white shadow-lg shadow-purple-100"
                    : "bg-slate-50 text-slate-400 hover:bg-slate-100",
                )}
                title={location.address}
              >
                {location.address?.split(",")[0] || "Location"}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => setStatus(opt.value)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                status === opt.value
                  ? "bg-[#E288F9] text-white shadow-lg shadow-purple-100"
                  : "bg-slate-50 text-slate-400 hover:bg-slate-100",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 space-y-4">
        {isLoadingBookings || isLoadingLocations ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-slate-200" />
          </div>
        ) : bookings?.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
            <p className="text-sm font-bold text-slate-400">
              {selectedLocationId
                ? `No bookings found for this location`
                : `No bookings found`}
            </p>
          </div>
        ) : (
          bookings?.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              isShopOwner={true}
              onApprove={handleApprove}
              onReject={handleReject}
              onCancel={handleCancel}
              onComplete={handleComplete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ShopBookingView;
