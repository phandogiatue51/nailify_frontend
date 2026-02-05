// /src/components/booking/ExistingBookings.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Clock, AlertCircle } from "lucide-react";

interface ExistingBookingsProps {
  bookings: any[];
  isLoading: boolean;
  currentBookingId?: string; 
}

export const ExistingBookings = ({
  bookings,
  isLoading,
  currentBookingId,
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
    <Card className="border-yellow-200 bg-yellow-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-2 mb-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800">Existing Bookings</h3>
            <p className="text-sm text-yellow-600">
              {filteredBookings.length} appointment(s) already scheduled
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {filteredBookings.slice(0, 3).map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between p-2 bg-white rounded border"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="font-medium">
                  {new Date(booking.scheduledStart).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {booking.durationMinutes} min
              </span>
            </div>
          ))}
          {filteredBookings.length > 3 && (
            <p className="text-sm text-yellow-600 text-center">
              + {filteredBookings.length - 3} more booking(s)
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
