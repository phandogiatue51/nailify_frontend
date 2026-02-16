import { Card, CardContent } from "@/components/ui/card";
import { BookingStatusBadge } from "@/components/badge/BookingStatusBadge";

interface PriceSummaryCardProps {
  collectionName?: string;
  status: number;
  durationMinutes: number;
  totalPrice: number;
}

export const PriceSummaryCard = ({
  collectionName,
  status,
  durationMinutes,
  totalPrice,
}: PriceSummaryCardProps) => (
  <Card className="border-none bg-gradient-to-r from-blue-50 to-purple-50 rounded-[2rem] shadow-sm">
    <CardContent className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="space-y-2">
          <h3 className="text-xl font-black text-slate-900">
            {collectionName || "Custom Service"}
          </h3>
          <div className="flex items-center gap-2">
            <BookingStatusBadge status={status} />
            <p className="text-xs font-bold text-slate-400">
              {durationMinutes} min
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-[#950101]">
            {totalPrice.toLocaleString()} <span className="text-lg">VND</span>
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);
