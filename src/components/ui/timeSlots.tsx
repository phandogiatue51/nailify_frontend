interface TimeSlotConfig {
  openingTime?: string | null;
  closingTime?: string | null;
  bufferMinutes?: number | null;
}

export const generateTimeSlots = ({
  openingTime,
  closingTime,
  bufferMinutes,
}: TimeSlotConfig): string[] => {
  if (!openingTime || !closingTime) {
    return [];
  }

  const slots = [];
  const [openHour, openMinute] = openingTime?.split(":").map(Number);
  const [closeHour, closeMinute] = closingTime?.split(":").map(Number);

  let currentHour = openHour;
  let currentMinute = openMinute;

  const closeTotalMinutes = closeHour * 60 + closeMinute;
  const interval = bufferMinutes;

  while (currentHour * 60 + currentMinute < closeTotalMinutes) {
    const timeString = `${currentHour.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;
    slots.push(timeString);

    currentMinute += interval;
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60);
      currentMinute %= 60;
    }
  }

  return slots;
};

export const DEFAULT_TIME_SLOTS = generateTimeSlots({});
