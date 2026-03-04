import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BookingStatusBadge } from "../badge/BookingStatusBadge";
import DateDisplay from "../ui/date-display";
import { getStatusConfig } from "../booking-status-config";
import { ConfirmationDialog } from "../ui/confirmation-dialog";
import {
  Booking,
  Shop,
  Profile,
  BookingItem,
  ServiceItem,
} from "@/types/database";
import { RatingCard } from "./detail/RatingCard";

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
  isLoading?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  isShopOwner,
  onApprove,
  onReject,
  onCancel,
  onComplete,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const statusConfig = getStatusConfig(booking.status, isShopOwner || false);

  return (
    <Card className="group border-none shadow-[0_4px_30px_rgba(0,0,0,0.02)] rounded-[2.5rem] overflow-hidden bg-white hover:shadow-[0_15px_45px_rgba(149,1,1,0.08)] transition-all duration-500">
      <CardContent className="p-7">
        {/* 1. Header: Status & Price */}
        <div className="flex justify-between items-center mb-2">
          <BookingStatusBadge status={booking.status} />
          <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 leading-none mb-1">
              Total Investment
            </p>
            <span className="text-xl font-black text-emerald-500 tracking-tight">
              {Number(booking.totalPrice).toLocaleString()}
              <span className="text-[10px] ml-1 text-slate-500">VND</span>
            </span>
          </div>
        </div>

        {/* 2. Artist Row */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#950101]/60 mb-2">
            Appointment with
          </p>
          {isShopOwner ? (
            <h4 className="font-black text-slate-800 text-lg leading-tight">
              {booking.customerName}
            </h4>
          ) : (
            <h4 className="font-black text-slate-800 text-lg leading-tight">
              {booking.nailArtistName || booking.shopName}
            </h4>
          )}

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold italic mt-2 mb-4">
            <MapPin className="w-3 h-3 text-[#FFCFE9]" />
            <span className="truncate">
              {booking.address || "Studio Location"}
            </span>
          </div>
        </div>

        {/* 3. Dedicated Time Row - Full Width Bar */}
        <div className="bg-slate-50/80 rounded-3xl p-5 flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">
              Check-in
            </p>
            <div className="text-xs font-black text-slate-700">
              <DateDisplay dateString={booking.scheduledStart} showTime />
            </div>
          </div>

          {/* Decorative center element */}
          <div className="flex-1 px-4 flex items-center justify-center">
            <div className="h-[2px] w-full bg-slate-200/50 rounded-full relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
            </div>
          </div>

          <div className="flex flex-col text-right">
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">
              Completion
            </p>
            <div className="text-xs font-black text-slate-700">
              <DateDisplay dateString={booking.scheduledEnd} showTime />
            </div>
          </div>
        </div>

        {booking.ratings && (
          <RatingCard ratings={booking.ratings} comment={booking.comment} />
        )}

        {/* 4. Footer: Refined Actions */}
        <div className="pt-4 border-t border-slate-50 flex flex-col gap-3">
          {/* Row 1: Contextual Actions - Only renders if there's content */}
          {((isShopOwner && [0, 1].includes(booking.status)) ||
            (!isShopOwner && booking.status === 3 && !booking.ratings)) && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {isShopOwner && booking.status === 0 && (
                <div className="flex w-full gap-2 items-center">
                  <ConfirmationDialog
                    {...statusConfig.reject}
                    onConfirm={() => onReject?.(booking.id)}
                    trigger={
                      <Button
                        variant="ghost"
                        className="flex-1 h-9 rounded-full text-red-400 font-black text-[9px] uppercase tracking-widest border border-red-300 hover:bg-red-500 hover:text-white transition-all"
                      >
                        Reject
                      </Button>
                    }
                  />
                  <ConfirmationDialog
                    {...statusConfig.approve}
                    onConfirm={() => onApprove?.(booking.id)}
                    trigger={
                      <Button
                        variant="ghost"
                        className="flex-1 h-9 rounded-full text-emerald-500 font-black text-[9px] uppercase tracking-widest border border-emerald-300 hover:bg-emerald-500 hover:text-white transition-all"
                      >
                        Approve
                      </Button>
                    }
                  />
                </div>
              )}

              {isShopOwner && booking.status === 1 && (
                <div className="flex w-full gap-2 items-center">
                  <ConfirmationDialog
                    {...statusConfig.cancel}
                    onConfirm={() => onCancel?.(booking.id)}
                    trigger={
                      <Button
                        variant="ghost"
                        className="flex-1 h-9 rounded-full text-red-400 font-black text-[9px] uppercase tracking-widest border border-red-300 hover:bg-red-500 hover:text-white transition-all"
                      >
                        Cancel
                      </Button>
                    }
                  />
                  <ConfirmationDialog
                    {...statusConfig.complete}
                    onConfirm={() => onComplete?.(booking.id)}
                    trigger={
                      <Button
                        variant="ghost"
                        className="flex-1 h-9 rounded-full text-emerald-500 font-black text-[9px] uppercase tracking-widest border border-emerald-300 hover:bg-emerald-500 hover:text-white transition-all"
                      >
                        Complete
                      </Button>
                    }
                  />
                </div>
              )}

              {!isShopOwner && booking.status === 3 && !booking.ratings && (
                <Button
                  onClick={() => navigate(`/booking/rating/${booking.id}`)}
                  className="h-12 w-full px-5 rounded-full text-blue-500 font-black text-[9px] uppercase tracking-widest border border-blue-300 hover:bg-blue-100 bg-white"
                >
                  Leave a Review
                </Button>
              )}
            </div>
          )}

          {/* Row 2: Primary Action - Full Width */}
          <Button
            onClick={() => navigate(`/booking/detail/${booking.id}`)}
            className="w-full h-11 rounded-full font-black uppercase text-[10px] tracking-[0.2em] text-white shadow-lg shadow-[#950101]/10 hover:opacity-90 active:scale-[0.98] transition-all"
            style={{
              background: "linear-gradient(135deg, #950101 0%, #D81B60 100%)",
            }}
          >
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
