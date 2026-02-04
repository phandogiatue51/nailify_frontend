import { useState } from "react";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import { useShop } from "@/hooks/useShop";
import { useBookings } from "@/hooks/useBookings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronLeft, ChevronRight, Clock, User } from "lucide-react";
import {
  format,
  isSameDay,
  parseISO,
  addDays,
  startOfWeek,
  addWeeks,
} from "date-fns";
import { BookingStatus } from "@/types/database";
import { cn } from "@/lib/utils";
import { BookingStatusBadge } from "@/components/badge/BookingStatusBadge";

const SchedulePage = () => {
  const { user, loading } = useAuthContext();
  const { myShop, shopLoading } = useShop();
  const { useShopBookings, updateBookingStatus } = useBookings();
  const { data: bookings, isLoading: bookingsLoading } = useShopBookings(
    myShop?.id,
  );

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week">("day");

  if (loading || shopLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (user?.role !== 1) {
    return <Navigate to="/" replace />;
  }

  if (!myShop) {
    return <Navigate to="/my-shop" replace />;
  }

  // Get bookings for selected date
  const dayBookings =
    bookings?.filter((b) =>
      isSameDay(parseISO(b.booking_date), selectedDate),
    ) || [];

  // Get week's bookings
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekBookings =
    bookings?.filter((b) =>
      weekDays.some((day) => isSameDay(parseISO(b.booking_date), day)),
    ) || [];

  // Get dates with bookings for calendar highlighting
  const datesWithBookings =
    bookings?.map((b) => parseISO(b.booking_date)) || [];

  const handleApprove = async (bookingId: string) => {
    await updateBookingStatus.mutateAsync({ bookingId, status: 1 });
  };

  const handleReject = async (bookingId: string) => {
    await updateBookingStatus.mutateAsync({ bookingId, status: 2 });
  };

  const handleComplete = async (bookingId: string) => {
    await updateBookingStatus.mutateAsync({ bookingId, status: 3 });
  };

  const renderBookingCard = (booking: any) => (
    <Card key={booking.id} className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold">{booking.booking_time}</span>
          </div>
          <p className="text-md text-muted-foreground">
            <BookingStatusBadge status={booking.status} />
          </p>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">
            {booking.customer?.full_name || "Unknown"}
          </span>
        </div>

        {booking.items && booking.items.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-1">Services:</p>
            <div className="flex flex-wrap gap-1">
              {booking.items.map((item: any) => (
                <Badge key={item.id} variant="secondary" className="text-xs">
                  {item.service_item?.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="font-semibold text-primary">
            ${Number(booking.total_price).toFixed(2)}
          </span>

          <div className="flex gap-2">
            {booking.status === "pending" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReject(booking.id)}
                  disabled={updateBookingStatus.isPending}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleApprove(booking.id)}
                  disabled={updateBookingStatus.isPending}
                >
                  Approve
                </Button>
              </>
            )}
            {booking.status === "approved" && (
              <Button
                size="sm"
                onClick={() => handleComplete(booking.id)}
                disabled={updateBookingStatus.isPending}
              >
                Complete
              </Button>
            )}
          </div>
        </div>

        {booking.notes && (
          <p className="text-sm text-muted-foreground mt-2 p-2 bg-muted rounded">
            {booking.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div>
      <div className="p-4 space-y-4">
        <div className="pt-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Schedule</h1>
          <div className="flex gap-1">
            <Button
              variant={viewMode === "day" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("day")}
            >
              Day
            </Button>
            <Button
              variant={viewMode === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("week")}
            >
              Week
            </Button>
          </div>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setSelectedDate((d) =>
                viewMode === "day" ? addDays(d, -1) : addWeeks(d, -1),
              )
            }
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="font-semibold">
            {viewMode === "day"
              ? format(selectedDate, "EEEE, MMM d")
              : `Week of ${format(weekStart, "MMM d")}`}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setSelectedDate((d) =>
                viewMode === "day" ? addDays(d, 1) : addWeeks(d, 1),
              )
            }
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Calendar Preview */}
        <Card>
          <CardContent className="p-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              modifiers={{ hasBooking: datesWithBookings }}
              modifiersStyles={{
                hasBooking: { backgroundColor: "hsl(var(--primary) / 0.1)" },
              }}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Bookings */}
        {bookingsLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : viewMode === "day" ? (
          <div>
            <h3 className="font-semibold mb-3">
              {dayBookings.length} booking{dayBookings.length !== 1 ? "s" : ""}{" "}
              on {format(selectedDate, "MMM d")}
            </h3>
            {dayBookings.length > 0 ? (
              dayBookings
                .sort((a, b) => a.booking_time.localeCompare(b.booking_time))
                .map(renderBookingCard)
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <p>No bookings for this day</p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {weekDays.map((day) => {
              const dayBookingsFiltered = weekBookings.filter((b) =>
                isSameDay(parseISO(b.booking_date), day),
              );
              return (
                <div key={day.toISOString()}>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    {format(day, "EEE, MMM d")}
                    {dayBookingsFiltered.length > 0 && (
                      <Badge variant="secondary">
                        {dayBookingsFiltered.length}
                      </Badge>
                    )}
                  </h3>
                  {dayBookingsFiltered.length > 0 ? (
                    dayBookingsFiltered
                      .sort((a, b) =>
                        a.booking_time.localeCompare(b.booking_time),
                      )
                      .map(renderBookingCard)
                  ) : (
                    <p className="text-sm text-muted-foreground mb-3">
                      No bookings
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;
