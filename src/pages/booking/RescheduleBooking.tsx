// /src/pages/booking/RescheduleBooking.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useBookings } from "@/hooks/useBookings";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ExistingBookings } from "@/components/booking/ExistingBookings";

const RescheduleBooking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { useBookingById, updateBooking } = useBookings();

  // Get the booking to reschedule
  const { data: booking, isLoading } = useBookingById(id);
  const updateMutation = updateBooking;

  // State for datetime selection
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set initial values from booking
  useEffect(() => {
    if (booking) {
      // Parse the scheduledStart to get date and time
      const bookingDate = new Date(booking.scheduledStart);
      const dateStr = bookingDate.toISOString().split('T')[0];
      const timeStr = format(bookingDate, 'HH:mm');
      
      setSelectedDate(dateStr);
      setSelectedTime(timeStr);
    }
  }, [booking]);

  // Get existing bookings for conflict checking
  const { data: existingBookings = [], isLoading: bookingsLoading } = 
    booking?.shopLocationId 
      ? useBookings().useLocationBookings(
          booking.shopLocationId,
          selectedDate ? new Date(selectedDate) : undefined,
        )
      : booking?.nailArtistId
      ? useBookings().useArtistBookings(
          selectedDate ? new Date(selectedDate) : undefined,
        )
      : { data: [], isLoading: false };

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime || !booking) {
      toast({
        title: "Error",
        description: "Please select both date and time",
        variant: "destructive",
      });
      return;
    }

    // Combine date and time
    const newDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
    const scheduledStart = newDateTime.toISOString();

    // Check if the new time is in the past
    if (newDateTime < new Date()) {
      toast({
        title: "Invalid Time",
        description: "Cannot schedule booking in the past",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Update only the scheduledStart
      await updateMutation.mutateAsync({
        id: booking.id,
        data: {
          scheduledStart,
          // Keep all other fields from existing booking
          collectionId: booking.collectionId || null,
          bookingItems: booking.bookingItems.map(item => ({
            serviceItemId: item.serviceItemId,
          })),
          notes: booking.notes || null,
          customerName: booking.customerName || null,
          customerPhone: booking.customerPhone || null,
          customerAddress: booking.customerAddress || null,
        },
      });

      toast({
        title: "Booking Rescheduled",
        description: "Your appointment has been updated successfully",
        variant: "success",
      });

      // Navigate back to booking details with success state
      navigate(`/booking/${booking.id}`, {
        state: { success: true },
      });
    } catch (error) {
      console.error("Reschedule error:", error);
      toast({
        title: "Reschedule Failed",
        description: "Failed to update booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto" />
              <h2 className="text-2xl font-bold">Booking Not Found</h2>
              <p className="text-muted-foreground">
                Unable to find the booking to reschedule.
              </p>
              <Button onClick={() => navigate("/bookings")} className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Bookings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold">Reschedule Booking</h1>
          <p className="text-sm text-muted-foreground">
            Update date and time for your appointment
          </p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Current Booking Info */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Current Appointment</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(new Date(booking.scheduledStart), "EEEE, MMMM d, yyyy")}
                </span>
                <Clock className="w-4 h-4 ml-2" />
                <span>
                  {format(new Date(booking.scheduledStart), "h:mm a")}
                </span>
              </div>
              <p className="text-sm">
                {booking.collectionName || "Custom Service"} • {booking.durationMinutes} min
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Date Selection */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Select New Date</h2>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-3 border rounded-lg"
            />
          </CardContent>
        </Card>

        {selectedDate && (
          <>
            {/* Time Selection */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold">Select New Time</h2>
                </div>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />
              </CardContent>
            </Card>

            {/* Show existing bookings for the selected date */}
            {selectedDate && (booking.shopLocationId || booking.nailArtistId) && (
              <ExistingBookings 
                bookings={existingBookings} 
                isLoading={bookingsLoading} 
                currentBookingId={booking.id}
              />
            )}
          </>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/booking/${booking.id}`)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleReschedule}
            disabled={!selectedDate || !selectedTime || isSubmitting}
            className="flex-1 h-12 text-lg"
          >
            {isSubmitting ? "Updating..." : "Confirm Reschedule"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleBooking;