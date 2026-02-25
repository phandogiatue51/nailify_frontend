// components/booking/BookingView.tsx
import { useState, useEffect } from "react";
import { useBookings } from "@/hooks/useBookings";
import BookingCard from "@/components/booking/BookingCard";
import { BookingStatus } from "@/types/database";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Calendar } from "@/components/ui/calendar";
import { MobilePagination } from "../ui/pagination-mobile";
import { useShopOwnerLocations } from "@/hooks/useLocation";
import { CalendarIcon, Loader2, List } from "lucide-react";
import BookingCalendarView from "./BookingCalendarView";
import { MapPin } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, endOfDay } from "date-fns";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  { label: "All", value: undefined },
  { label: "Pending", value: 0 },
  { label: "Approved", value: 1 },
  { label: "Rejected", value: 2 },
  { label: "Completed", value: 3 },
  { label: "Cancelled", value: 4 },
] as const;

export type UserRole = "customer" | "nailArtist" | "shop" | "staff";

interface BookingViewProps {
  role: UserRole;
  title?: string;
}

const BookingView: React.FC<BookingViewProps> = ({
  role,
  title = "Appointments",
}) => {
  const [status, setStatus] = useState<BookingStatus | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const auth = useAuth();
  const { filterBookings, updateBookingStatus } = useBookings();
  const [selectedLocationId, setSelectedLocationId] = useState<
    string | undefined
  >(undefined);
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  const { locations = [], isLoading: isLoadingLocations } =
    role === "shop"
      ? useShopOwnerLocations()
      : { locations: [], isLoading: false };
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const refetchFilteredBookings = () => {
    const dateToSend = date ? endOfDay(date).toISOString() : null;
    const filters: any = {
      Date: dateToSend,
      Status: status,
    };

    switch (role) {
      case "customer":
        if (auth.user?.userId) {
          filters.CustomerId = auth.user.userId;
        }
        break;
      case "nailArtist":
        if (auth.user?.nailArtistId) {
          filters.NailArtistId = auth.user.nailArtistId;
        }
        break;
      case "shop":
        if (auth.user?.shopId) {
          filters.ShopId = auth.user.shopId;
          if (selectedLocationId) {
            filters.ShopLocationId = selectedLocationId;
          }
        }
        break;
      case "staff":
        if (auth.user?.shopLocationId) {
          filters.ShopLocationId = auth.user.shopLocationId;
        }
        break;
    }

    if (Object.keys(filters).some((key) => filters[key] !== undefined)) {
      filterBookings.mutate(filters);
    }
  };

  const handleApprove = (bookingId: string) => {
    setUpdatingBookingId(bookingId);
    updateBookingStatus.mutate(
      { bookingId, status: 1 },
      {
        onSettled: () => {
          setUpdatingBookingId(null);
          refetchFilteredBookings();
        },
      },
    );
  };

  const handleReject = (bookingId: string) => {
    setUpdatingBookingId(bookingId);
    updateBookingStatus.mutate(
      { bookingId, status: 2 },
      {
        onSettled: () => {
          setUpdatingBookingId(null);
          refetchFilteredBookings();
        },
      },
    );
  };

  const handleCancel = (bookingId: string) => {
    setUpdatingBookingId(bookingId);
    updateBookingStatus.mutate(
      { bookingId, status: 4 },
      {
        onSettled: () => {
          setUpdatingBookingId(null);
          refetchFilteredBookings();
        },
      },
    );
  };

  const handleComplete = (bookingId: string) => {
    setUpdatingBookingId(bookingId);
    updateBookingStatus.mutate(
      { bookingId, status: 3 },
      {
        onSettled: () => {
          setUpdatingBookingId(null);
          refetchFilteredBookings();
        },
      },
    );
  };

  useEffect(() => {
    const dateToSend = date ? endOfDay(date).toISOString() : null;
    setCurrentPage(1);

    const filters: any = {
      Date: dateToSend,
      Status: status,
    };

    switch (role) {
      case "customer":
        if (auth.user?.userId) {
          filters.CustomerId = auth.user.userId;
          filterBookings.mutate(filters);
        }
        break;
      case "nailArtist":
        if (auth.user?.nailArtistId) {
          filters.NailArtistId = auth.user.nailArtistId;
          filterBookings.mutate(filters);
        }
        break;
      case "shop":
        if (auth.user?.shopId) {
          filters.ShopId = auth.user.shopId;
          if (selectedLocationId) {
            filters.ShopLocationId = selectedLocationId;
          }
          filterBookings.mutate(filters);
        }
        break;
      case "staff":
        if (auth.user?.shopLocationId) {
          filters.ShopLocationId = auth.user.shopLocationId;
          filterBookings.mutate(filters);
        }
        break;
    }
  }, [
    status,
    date,
    auth.user,
    role,
    filterBookings.mutate,
    selectedLocationId,
  ]);
  const isShopOwner = role !== "customer";
  const { data: bookings, isPending: isLoading } = filterBookings;

  return (
    <div className="p-4 space-y-6 bg-slate-50/30 min-h-screen">
      <div className="sticky top-0 bg-white/90 backdrop-blur-md z-20 pt-2 pb-4 px-4 border-b border-slate-50 space-y-4">
        <h2 className="text-xl font-black tracking-tight">{title}</h2>

        <div className="flex items-center justify-between">
          <div className="flex rounded-xl bg-slate-50 p-1">
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-md font-bold transition-all flex items-center gap-1.5",
                viewMode === "list"
                  ? "bg-white text-[#D81B60] shadow-sm"
                  : "text-slate-400 hover:text-slate-600",
              )}
            >
              <List className="h-3.5 w-3.5" />
              List
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-md font-bold transition-all flex items-center gap-1.5",
                viewMode === "calendar"
                  ? "bg-white text-[#D81B60] shadow-sm"
                  : "text-slate-400 hover:text-slate-600",
              )}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              Calendar
            </button>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="h-9 rounded-xl bg-slate-50 text-xs font-bold text-md"
              >
                <CalendarIcon className="mr-2 h-3.5 w-3.5 text-[#D81B60]" />
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

        <div className="grid grid-cols-3 gap-2 px-4">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => setStatus(opt.value)}
              className={cn(
                "py-2.5 rounded-xl text-[12px] font-black uppercase  transition-all border-2",
                status === opt.value
                  ? "bg-[#D81B60] border-[#D81B60] text-white shadow-md shadow-red-100"
                  : "bg-white border-slate-50 text-slate-400 hover:border-slate-100",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {role === "shop" && locations && locations.length > 0 && (
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
      </div>

      {/* Main Content */}
      <div className="px-4">
        {filterBookings.isPending || (role === "shop" && isLoadingLocations) ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-slate-200" />
          </div>
        ) : bookings?.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
            <p className="text-sm font-bold text-slate-400">
              {role === "shop" && selectedLocationId
                ? `No bookings found for this location`
                : `No bookings found`}
            </p>
          </div>
        ) : viewMode === "list" ? (
          <div className="space-y-4">
            {bookings
              ?.slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  isShopOwner={isShopOwner}
                  onApprove={isShopOwner ? handleApprove : undefined}
                  onReject={isShopOwner ? handleReject : undefined}
                  onCancel={handleCancel}
                  onComplete={isShopOwner ? handleComplete : undefined}
                  isLoading={
                    updatingBookingId === booking.id &&
                    updateBookingStatus.isPending
                  }
                />
              ))}

            {bookings && bookings.length > pageSize && (
              <div className="pt-6 mt-6 border-t border-slate-100">
                <MobilePagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(bookings.length / pageSize)}
                  onPageChange={handlePageChange}
                  totalItems={bookings.length}
                  visibleItems={Math.min(
                    pageSize,
                    bookings.length - (currentPage - 1) * pageSize,
                  )}
                />
              </div>
            )}
          </div>
        ) : (
          <BookingCalendarView
            bookings={bookings || []}
            role={role}
            onApprove={isShopOwner ? handleApprove : undefined}
            onReject={isShopOwner ? handleReject : undefined}
            onCancel={handleCancel}
            onComplete={isShopOwner ? handleComplete : undefined}
            isLoading={updateBookingStatus.isPending}
            updatingBookingId={updatingBookingId}
          />
        )}
      </div>
    </div>
  );
};

export default BookingView;
