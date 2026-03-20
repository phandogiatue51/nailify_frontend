import { format } from "date-fns";

interface Booking {
    scheduledStart: string;
    scheduledEnd?: string;
    durationMinutes?: number;
}

interface LocationSettings {
    maxConcurrentBookings?: number;
    bufferMinutes?: number;
    closingTime?: string;
}

interface AvailabilityCheckParams {
    slotTimeStr: string;
    selectedDate: Date;
    bookings: Booking[];
    isArtistBooking: boolean;
    locationSettings?: LocationSettings;
    calculatedDuration?: number;
}

/**
 * Check if a time slot is busy
 * For artists: checks if artist has any overlapping booking
 * For locations: checks if location has reached max concurrent capacity
 */
export const isSlotBusy = ({
    slotTimeStr,
    selectedDate,
    bookings,
    isArtistBooking,
    locationSettings,
}: AvailabilityCheckParams): boolean => {
    const [hours, minutes] = slotTimeStr.split(":").map(Number);
    const slotDate = new Date(selectedDate);
    slotDate.setHours(hours, minutes, 0, 0);

    // For artist bookings - check if THIS artist is busy
    if (isArtistBooking) {
        // Check if artist has ANY booking at this time
        const hasOverlap = bookings.some((booking) => {
            const start = new Date(booking.scheduledStart);
            const end = booking.scheduledEnd
                ? new Date(booking.scheduledEnd)
                : new Date(start.getTime() + (booking.durationMinutes || 0) * 60000);

            // Check if slot overlaps with booking
            return slotDate >= start && slotDate < end;
        });

        return hasOverlap;
    }

    // For location bookings - check capacity
    const maxCapacity = locationSettings?.maxConcurrentBookings || 1;
    const buffer = locationSettings?.bufferMinutes || 15;

    const overlappingCount = bookings.filter((booking) => {
        const start = new Date(booking.scheduledStart);
        const end = new Date(
            start.getTime() + ((booking.durationMinutes || 0) + buffer) * 60000,
        );

        return slotDate >= start && slotDate < end;
    }).length;

    return overlappingCount >= maxCapacity;
};

/**
 * Check if a time slot can complete before closing time
 */
export const canCompleteBeforeClose = (
    slotTimeStr: string,
    closingTime: string | undefined,
    calculatedDuration: number,
    bufferMinutes: number = 0
): boolean => {
    if (!closingTime) return true;

    const [slotHour, slotMinute] = slotTimeStr.split(":").map(Number);
    const [closeHour, closeMinute] = closingTime.split(":").map(Number);

    const slotStartMinutes = slotHour * 60 + slotMinute;
    const closeMinutes = closeHour * 60 + closeMinute;
    const totalDuration = calculatedDuration + bufferMinutes;

    return slotStartMinutes + totalDuration <= closeMinutes;
};

/**
 * Check if a time slot is in the past (for today only)
 */
export const isSlotInPast = (
    slotTimeStr: string,
    selectedDate: Date
): boolean => {
    const [hours, minutes] = slotTimeStr.split(":").map(Number);
    const slotDate = new Date(selectedDate);
    slotDate.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const isToday =
        format(selectedDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");

    return isToday && slotDate < now;
};

/**
 * Get available time slots from a list of all slots
 */
export const getAvailableTimeSlots = (
    allSlots: string[],
    selectedDate: Date,
    bookings: Booking[],
    isArtistBooking: boolean,
    locationSettings?: LocationSettings,
    calculatedDuration: number = 0
): string[] => {
    return allSlots.filter((slot) => {
        const busy = isSlotBusy({
            slotTimeStr: slot,
            selectedDate,
            bookings,
            isArtistBooking,
            locationSettings,
        });

        const past = isSlotInPast(slot, selectedDate);

        const canComplete = canCompleteBeforeClose(
            slot,
            locationSettings?.closingTime,
            calculatedDuration,
            locationSettings?.bufferMinutes
        );

        return !busy && !past && canComplete;
    });
};

/**
 * Group time slots by period of day
 */
export const groupTimeSlotsByPeriod = (timeSlots: string[]) => {
    return {
        morning: timeSlots.filter(slot => parseInt(slot.split(":")[0]) < 11),
        afternoon: timeSlots.filter(slot => {
            const hour = parseInt(slot.split(":")[0]);
            return hour >= 11 && hour < 14;
        }),
        evening: timeSlots.filter(slot => {
            const hour = parseInt(slot.split(":")[0]);
            return hour >= 14 && hour < 18;
        }),
        night: timeSlots.filter(slot => parseInt(slot.split(":")[0]) >= 18),
    };
};

/**
 * Check if a slot is available (not busy, not past, can complete)
 */
export const isSlotAvailable = (
    slotTimeStr: string,
    selectedDate: Date,
    bookings: Booking[],
    isArtistBooking: boolean,
    locationSettings?: LocationSettings,
    calculatedDuration: number = 0
): boolean => {
    const busy = isSlotBusy({
        slotTimeStr,
        selectedDate,
        bookings,
        isArtistBooking,
        locationSettings,
    });

    const past = isSlotInPast(slotTimeStr, selectedDate);

    const canComplete = canCompleteBeforeClose(
        slotTimeStr,
        locationSettings?.closingTime,
        calculatedDuration,
        locationSettings?.bufferMinutes
    );

    return !busy && !past && canComplete;
};

/**
 * Get slot status for UI display
 */
export const getSlotStatus = (
    slotTimeStr: string,
    selectedDate: Date,
    bookings: Booking[],
    isArtistBooking: boolean,
    locationSettings?: LocationSettings,
    calculatedDuration: number = 0
): {
    isBusy: boolean;
    isPast: boolean;
    canComplete: boolean;
    isAvailable: boolean;
} => {
    const isBusy = isSlotBusy({
        slotTimeStr,
        selectedDate,
        bookings,
        isArtistBooking,
        locationSettings,
    });

    const isPast = isSlotInPast(slotTimeStr, selectedDate);

    const canComplete = canCompleteBeforeClose(
        slotTimeStr,
        locationSettings?.closingTime,
        calculatedDuration,
        locationSettings?.bufferMinutes
    );

    return {
        isBusy,
        isPast,
        canComplete,
        isAvailable: !isBusy && !isPast && canComplete,
    };
};