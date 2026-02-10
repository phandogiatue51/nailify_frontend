import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BookingStatusBadge } from "../badge/BookingStatusBadge";
import DateDisplay from "../ui/date-display";
import {
  Booking,
  Shop,
  Profile,
  BookingItem,
  ServiceItem,
} from "@/types/database";

interface BookingCardProps {
  booking: Booking & {
    shop?: Shop;
    customer?: Profile;
    items?: (BookingItem & { service_item?: ServiceItem })[];
  };
  isShopOwner?: boolean;
  onApprove?: (bookingId: string) => void;
  onReject?: (bookingId: string) => void;
  onCancel?: (bookingId: string) => void;
  onComplete?: (bookingId: string) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  isShopOwner,
  onApprove,
  onReject,
  onCancel,
  onComplete,
}) => {
  const navigate = useNavigate();

  return (
    <Card className="group border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-[2rem] overflow-hidden bg-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-slate-50 rounded-2xl p-3 items-center min-w-[60px]">
            <span className="text-sm font-black text-slate-700">
              <DateDisplay
                dateString={booking.scheduledStart}
                label="Start At"
                showTime
              />
            </span>
            <span className="text-sm font-black text-slate-700">
              <DateDisplay
                dateString={booking.scheduledEnd}
                label="End At"
                showTime
              />
            </span>
          </div>
          <div className="flex flex-col items-end gap-2">
            <BookingStatusBadge status={booking.status} />
          </div>
        </div>

        {/* Customer/Artist Info */}
        <div className="space-y-1 mb-4">
          <h4 className="font-black text-slate-800 flex items-center gap-2">
            {isShopOwner ? booking.customerName : booking.shopName}
          </h4>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold">
            <MapPin className="w-3 h-3 text-[#FFC988]" />
            <span className="truncate">
              {booking.address || "Studio Location"}
            </span>
          </div>
        </div>

        {/* Services Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {booking.items?.map((item) => (
            <Badge
              key={item.id}
              variant="secondary"
              className="bg-purple-50 text-[#E288F9] border-none text-[9px] font-black px-2 py-0.5 rounded-lg uppercase"
            >
              {item.serviceItem?.name}
            </Badge>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-50 gap-3">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-300 uppercase leading-none">
              Total
            </span>
            <span className="text-lg font-black text-slate-900 leading-tight">
              {Number(booking.totalPrice).toLocaleString()}{" "}
              <span className="text-[10px]">VND</span>
            </span>
          </div>

          <div className="flex gap-2">
            {isShopOwner && (
              <>
                {booking.status === 0 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onReject?.(booking.id)}
                      className="rounded-xl text-red-400 font-black text-[10px] uppercase hover:bg-red-50"
                    >
                      Reject
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onApprove?.(booking.id)}
                      className="rounded-xl text-emerald-400 font-black text-[10px] uppercase hover:bg-emerald-50"
                    >
                      Approve
                    </Button>
                  </>
                )}

                {booking.status === 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCancel?.(booking.id)}
                      className="rounded-xl text-red-400 font-black text-[10px] uppercase hover:bg-red-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onComplete?.(booking.id)}
                      className="rounded-xl text-emerald-400 font-black text-[10px] uppercase hover:bg-emerald-50"
                    >
                      Complete
                    </Button>
                  </>
                )}
              </>
            )}

            {!isShopOwner && (booking.status === 0 || booking.status === 1) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCancel?.(booking.id)}
                className="rounded-xl text-red-400 font-black text-[10px] uppercase hover:bg-red-50"
              >
                Cancel
              </Button>
            )}

            <Button
              size="sm"
              onClick={() => navigate(`/booking/detail/${booking.id}`)}
              className="rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase px-4 h-9 shadow-lg shadow-slate-200"
            >
              Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
