// components/booking/ExistingBookings.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ExistingBookingsProps {
  bookings: any[];
  isLoading: boolean;
}

export const ExistingBookings = ({
  bookings,
  isLoading,
}: ExistingBookingsProps) => {

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="font-semibold mb-4">Existing Bookings</h2>
        {isLoading ? (
          <div className="flex justify-center py-2">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-2">
            {bookings.map((booking) => (
              <div key={booking.id} className="p-3 border rounded">
                <div className="flex justify-between">
                  <span className="font-medium">{booking.customerName}</span>
                  <span
                    className={`text-sm ${
                      booking.status === "Approved"
                        ? "text-green-600"
                        : booking.status === "Pending"
                          ? "text-yellow-600"
                          : "text-gray-600"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(booking.scheduledStart).toLocaleTimeString()} -
                  {new Date(booking.scheduledEnd).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No bookings for this date</p>
        )}
      </CardContent>
    </Card>
  );
};
