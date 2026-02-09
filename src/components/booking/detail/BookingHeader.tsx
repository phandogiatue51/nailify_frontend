import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingHeaderProps {
  bookingId?: string;
  onBack: () => void;
}

export const BookingHeader = ({ bookingId, onBack }: BookingHeaderProps) => (
  <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b px-6 py-4">
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className="rounded-full"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>
      <div>
        <h1 className="text-xl font-black text-slate-900">Booking Details</h1>
        {bookingId && (
          <p className="text-xs font-bold text-slate-400 tracking-wider">
            ID: {bookingId}
          </p>
        )}
      </div>
    </div>
  </div>
);
