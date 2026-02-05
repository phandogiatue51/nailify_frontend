import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useBookings } from "@/hooks/useBookings";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ExistingBookings } from "@/components/booking/ExistingBookings";

const DateTimeSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    selectedItems,
    selectedCollection,
    shopId,
    artistId,
    selectedLocation,
    customerName,
    customerPhone,
    customerAddress,
    notes,
  } = location.state || {};

  const isArtistBooking = !!artistId;

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  const { data: bookings = [], isLoading: bookingsLoading } = isArtistBooking
    ? useBookings().useArtistBookings(
      selectedDate ? new Date(selectedDate) : undefined,
    )
    : useBookings().useLocationBookings(
      selectedLocation,
      selectedDate ? new Date(selectedDate) : undefined,
    );

  const handleNext = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select date and time");
      return;
    }

    navigate("/booking/confirm-booking", {
      state: {
        selectedItems,
        selectedCollection,
        shopId,
        artistId,
        selectedLocation,
        selectedDate,
        selectedTime,
        customerName,
        customerPhone,
        customerAddress,
        notes,
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">Select Date & Time</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Date Selection */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Select Date</h2>
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
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Select Time</h2>
              </div>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </CardContent>
          </Card>
        )}

        {selectedDate && (selectedLocation || artistId) && (
          <ExistingBookings bookings={bookings} isLoading={bookingsLoading} />
        )}
      </div>

      <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-4">
        <Button
          onClick={handleNext}
          disabled={!selectedDate || !selectedTime}
          className="w-full h-12 text-lg"
        >
          Next: Review Booking
        </Button>
      </div>
    </div>
  );
};

export default DateTimeSelection;
