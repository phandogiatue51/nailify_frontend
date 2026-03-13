// components/booking/DateTimeStep.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

interface DateTimeStepProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
}

export const DateTimeStep = ({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
}: DateTimeStepProps) => {
  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Chọn ngày</h2>
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

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Chọn giờ</h2>
          </div>

          <input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
        </CardContent>
      </Card>
    </>
  );
};