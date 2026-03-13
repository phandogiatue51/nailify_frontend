import { ArrowLeft, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingHeaderProps {
  bookingId?: string;
  onBack: () => void;
}

export const BookingHeader = ({ bookingId, onBack }: BookingHeaderProps) => (
  <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b px-6 py-4">
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        onClick={onBack}
        className="group rounded-full border-2 border-slate-400 hover:border-[#950101] transition-all px-3"
      >
        <ChevronLeft className="h-5 w-5 text-slate-600 group-hover:text-[#950101] transition-transform" />
      </Button>
      <div>
        <h1
          className="font-black tracking-tight uppercase text-xl bg-clip-text text-transparent pb-1"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
            WebkitBackgroundClip: "text",
          }}
        >
          Chi tiết cuộc hẹn
        </h1>
        {/* {bookingId && (
          <p className="text-xs font-bold text-slate-400 tracking-wider">
            ID: {bookingId}
          </p>
        )} */}
      </div>
    </div>
  </div>
);
