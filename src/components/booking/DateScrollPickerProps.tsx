import React, { useState, useMemo } from "react";
import { format, addDays, isSameDay, startOfToday } from "date-fns";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";

interface DateScrollPickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const DateScrollPicker: React.FC<DateScrollPickerProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const [viewStartDate, setViewStartDate] = useState(startOfToday());
  const today = startOfToday();

  const visibleDays = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => addDays(viewStartDate, i));
  }, [viewStartDate]);

  const nextWeek = () => setViewStartDate((prev) => addDays(prev, 5));
  const prevWeek = () => {
    const newStart = addDays(viewStartDate, -5);
    if (newStart < today) {
      setViewStartDate(today);
    } else {
      setViewStartDate(newStart);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-50 rounded-xl">
            <CalendarIcon className="w-4 h-4 text-[#E288F9]" />
          </div>
          <h2 className="text-sm font-black uppercase tracking-tight text-slate-700">
            {format(viewStartDate, "MMMM yyyy")}
          </h2>
        </div>

        <div className="flex gap-1">
          <button
            onClick={prevWeek}
            disabled={isSameDay(viewStartDate, today)}
            className="p-2 rounded-xl bg-white border border-slate-500 disabled:opacity-30 disabled:bg-slate-50 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextWeek}
            className="p-2 rounded-xl bg-white border border-slate-500 hover:bg-slate-50 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex justify-between gap-2 overflow-x-auto pb-2 no-scrollbar">
        {visibleDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, today);

          return (
            <button
              key={day.toString()}
              onClick={() => onDateChange(day)}
              className={cn(
                "flex flex-col items-center min-w-[50px] flex-1 p-4 rounded-[2rem] transition-all duration-300 ",
                isSelected
                  ? "bg-gradient-to-r from-[#f988b3] to-[#FFC988] text-white"
                  : "bg-white border-slate-50 text-slate-500 hover:border-slate-200",
              )}
            >
              <span
                className={cn(
                  "text-[9px] font-black uppercase mb-1",
                  isSelected ? "text-purple-100" : "text-slate-400",
                )}
              >
                {format(day, "EEE")}
              </span>
              <span className="text-base font-black">{format(day, "d")}</span>
              {isToday && !isSelected && (
                <div className="w-1 h-1 rounded-full bg-[#E288F9] mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
