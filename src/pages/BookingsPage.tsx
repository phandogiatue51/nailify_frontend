import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { useBookings } from "@/hooks/useBookings";
import { Loader2, Calendar } from "lucide-react";
import BookingCard from "@/components/booking/BookingCard";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BookingsPage = () => {
  const { user, loading } = useAuthContext();
  const { customerBookings, customerBookingsLoading, cancelBooking } =
    useBookings();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Separate bookings by status
  const upcoming =
    customerBookings?.filter(
      (b) => b.status === "pending" || b.status === "approved",
    ) || [];
  const past =
    customerBookings?.filter(
      (b) =>
        b.status === "completed" ||
        b.status === "rejected" ||
        b.status === "cancelled",
    ) || [];

  const handleCancel = async (bookingId: string) => {
    await cancelBooking.mutateAsync(bookingId);
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-4">
        <div className="pt-4">
          <h1 className="text-2xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground">
            View and manage your appointments
          </p>
        </div>

        {customerBookingsLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : customerBookings && customerBookings.length > 0 ? (
          <Tabs defaultValue="upcoming">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">
                Upcoming ({upcoming.length})
              </TabsTrigger>
              <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4 mt-4">
              {upcoming.length > 0 ? (
                upcoming.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    isShopOwner={false}
                    onCancel={() => handleCancel(booking.id)}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No upcoming bookings</p>
                    <p className="text-sm">Book your next nail appointment!</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4 mt-4">
              {past.length > 0 ? (
                past.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    isShopOwner={false}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <p>No past bookings</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No bookings yet</p>
              <p className="text-sm">
                Find a nail shop and book your first appointment!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </MobileLayout>
  );
};

export default BookingsPage;
