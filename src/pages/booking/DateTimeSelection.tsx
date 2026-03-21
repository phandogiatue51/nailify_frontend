import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useBookings } from "@/hooks/useBookings";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ExistingBookings } from "@/components/booking/ExistingBookings";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";
import { DateScrollPicker } from "@/components/booking/DateScrollPickerProps";
import { useShopOwnerLocationById } from "@/hooks/useLocation";
import { generateTimeSlots } from "@/components/ui/timeSlots";
import { TimeSlotSelector } from "@/components/booking/TimeSlotSelectorProps";
import {
  isSlotBusy,
  canCompleteBeforeClose,
  isSlotInPast,
  getSlotStatus
} from "@/components/booking/bookingAvailability";
import {
  calculateTotalDuration
} from "@/components/booking/bookingCalculations";

const DateTimeSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const STORAGE_KEY = "nailify_booking_state";
  const persistedBooking = ((): any => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  })();

  const {
    selectedItems = [],
    selectedCollection,
    shopId,
    nailArtistId,
    selectedLocation,
    customerProfileId,
    customerName,
    customerPhone,
    customerAddress,
    notes,
  } = location.state || persistedBooking || {};

  useEffect(() => {
    if (!location.state || !location.state.selectedItems) {
      if (!selectedItems.length && !selectedCollection) {
        navigate("/customer-book", { state: persistedBooking });
      }
    }
  }, [location.state, selectedItems, selectedCollection, navigate, persistedBooking]);

  const isArtistBooking = !!nailArtistId;
  const { user } = useAuth();
  const isShopOwner = user?.role !== 0 && user?.role !== 2; // Not customer

  const [selectedDateObj, setSelectedDateObj] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const { data: locationSettings } = useShopOwnerLocationById(selectedLocation);

  // Calculate total duration
  const calculatedDuration = calculateTotalDuration(selectedCollection, selectedItems);

  // Update selectedDate when selectedDateObj changes
  useEffect(() => {
    setSelectedDate(format(selectedDateObj, "yyyy-MM-dd"));
  }, [selectedDateObj]);

  // Initialize to next available day if store is closed for today
  useEffect(() => {
    if (locationSettings?.closingTime) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      const [closeHour, closeMinute] = locationSettings.closingTime
        .split(":")
        .map(Number);

      if (
        currentHour > closeHour ||
        (currentHour === closeHour && currentMinute >= closeMinute)
      ) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setSelectedDateObj(tomorrow);
      }
    }
  }, [locationSettings?.closingTime]);

  const timeSlots = useMemo(() => {
    return generateTimeSlots({
      openingTime: locationSettings?.openingTime ?? "9:00",
      closingTime: locationSettings?.closingTime ?? "17:00",
      bufferMinutes: locationSettings?.bufferMinutes ?? 15,
    });
  }, [
    locationSettings?.openingTime,
    locationSettings?.closingTime,
    locationSettings?.bufferMinutes,
  ]);

  // Fetch bookings
  const artistBookingsQuery = useBookings().useArtistBookings(
    isArtistBooking && selectedDate ? new Date(selectedDate) : undefined
  );
  const locationBookingsQuery = useBookings().useLocationBookings(
    !isArtistBooking && selectedLocation && selectedDate ? selectedLocation : undefined,
    !isArtistBooking && selectedDate ? new Date(selectedDate) : undefined
  );

  const bookings = isArtistBooking
    ? artistBookingsQuery.data || []
    : locationBookingsQuery.data || [];

  const bookingsLoading = isArtistBooking
    ? artistBookingsQuery.isLoading
    : locationBookingsQuery.isLoading;

  // Wrap helper functions for TimeSlotSelector
  const isSlotBusyWrapper = (slot: string, bookingsList: any[]) => {
    return isSlotBusy({
      slotTimeStr: slot,
      selectedDate: selectedDateObj,
      bookings: bookingsList,
      isArtistBooking,
      locationSettings,
    });
  };

  const canCompleteBeforeCloseWrapper = (slot: string) => {
    return canCompleteBeforeClose(
      slot,
      locationSettings?.closingTime,
      calculatedDuration,
      locationSettings?.bufferMinutes || 0
    );
  };

  const isSlotInPastWrapper = (slot: string) => {
    return isSlotInPast(slot, selectedDateObj);
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
  };

  useEffect(() => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        selectedItems,
        selectedCollection,
        shopId,
        nailArtistId,
        selectedLocation,
        customerProfileId,
        customerName,
        customerPhone,
        customerAddress,
        notes,
        selectedDate,
        selectedTime,
      }),
    );
  }, [
    selectedItems,
    selectedCollection,
    shopId,
    nailArtistId,
    selectedLocation,
    customerProfileId,
    customerName,
    customerPhone,
    customerAddress,
    notes,
    selectedDate,
    selectedTime,
  ]);

  const handleNext = () => {
    if (!selectedDate || !selectedTime) {
      alert("Hãy chọn 1 ngày và giờ");
      return;
    }

    navigate("/booking/confirm-booking", {
      state: {
        selectedItems,
        selectedCollection,
        shopId,
        nailArtistId,
        selectedLocation,
        selectedDate,
        selectedTime,
        customerName,
        customerPhone,
        customerAddress,
        customerProfileId,
        notes,
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1
          className="font-black tracking-tight uppercase text-xl bg-clip-text text-transparent pb-1"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
            WebkitBackgroundClip: "text",
          }}
        >
          Chọn ngày và giờ
        </h1>
      </div>

      <div className="p-4 space-y-6">
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
          <CardContent className="p-4">
            <DateScrollPicker
              selectedDate={selectedDateObj}
              onDateChange={setSelectedDateObj}
            />
          </CardContent>
        </Card>

        {selectedDate && (
          <TimeSlotSelector
            timeSlots={timeSlots}
            selectedTime={selectedTime}
            onSelectTime={handleSelectTime}
            bookings={bookings}
            isShopOwner={isShopOwner}
            canCompleteBeforeClose={canCompleteBeforeCloseWrapper}
            isSlotBusy={isSlotBusyWrapper}
            isSlotInPast={isSlotInPastWrapper}
          />
        )}

        {isShopOwner && bookings.length > 0 && (
          <div className="mt-4">
            <ExistingBookings
              bookings={bookings}
              isLoading={bookingsLoading}
              isShopOwner={isShopOwner}
            />
          </div>
        )}
      </div>

      <div className="sticky bottom-0 left-0 right-0 p-4">
        <Button
          onClick={handleNext}
          disabled={!selectedDate || !selectedTime}
          style={{
            background:
              "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
            border: "none",
          }}
          className="font-black tracking-tight uppercase text-lg rounded-[2rem] w-full h-12"
        >
          Tiếp theo: xác nhận lịch hẹn
        </Button>
      </div>
    </div>
  );
};

export default DateTimeSelection;