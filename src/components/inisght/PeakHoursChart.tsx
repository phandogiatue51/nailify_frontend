// components/insights/PeakHoursChart.tsx
import React from "react";
import { PeakHourDto } from "@/types/database";
import { Clock } from "lucide-react";

interface PeakHoursChartProps {
  hours: PeakHourDto[];
}
const PeakHoursChart: React.FC<PeakHoursChartProps> = ({ hours }) => {
  if (!hours || hours.length === 0) {
    return (
      <div className="bg-white rounded-[2rem] border border-slate-50 p-8 text-center shadow-md">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">
          Mật Độ Khách Tại Studio
        </h3>
        <div className="py-12 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
            <Clock className="w-5 h-5 text-slate-300" />
          </div>
          <p className="text-xs font-bold text-slate-400 italic">
            Chưa có dữ liệu hoạt động
          </p>
        </div>
      </div>
    );
  }

  const maxBookings = Math.max(...hours.map((h) => h.bookingCount || 0));

  return (
    <div className="bg-white rounded-[2rem] border border-slate-50 p-8 shadow-md">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#950101]">
          Mật Độ Khách Tại Studio
        </h3>
        <span className="text-[9px] font-black px-2 py-1 rounded-md bg-slate-100 text-slate-500 uppercase tracking-tighter">
          Biểu Đồ Trực Tiếp
        </span>
      </div>

      <div className="space-y-6">
        {hours.map((hour, index) => {
          const intensity = (hour.bookingCount || 0) / maxBookings;

          return (
            <div key={index} className="group">
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-black text-slate-900 leading-none tracking-tighter">
                    {hour.displayHour}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#D81B60] opacity-60">
                    {/* Assuming hour.period is 'AM' or 'PM' */}
                    {hour.period}
                  </span>
                </div>

                <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  <span className="text-slate-900">{hour.bookingCount}</span>{" "}
                  Lượt hẹn
                </div>
              </div>

              {/* High-End Heatmap Bar */}
              <div className="relative w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-[#D81B60] to-[#950101]"
                  style={{
                    width: `${intensity * 100}%`,
                    opacity: 0.3 + intensity * 0.7,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-[9px] font-bold text-slate-300 uppercase tracking-[0.1em] text-center leading-relaxed">
        Dữ liệu được chuẩn hóa dựa trên công suất tối đa
      </p>
    </div>
  );
};

export default PeakHoursChart;
