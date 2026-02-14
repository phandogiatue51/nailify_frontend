import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BookingStatusBadge } from "../badge/BookingStatusBadge";
import DateDisplay from "../ui/date-display";
import { Loader2 } from "lucide-react";
import { getStatusConfig } from "../booking-status-config";
import { ConfirmationDialog } from "../ui/confirmation-dialog";
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
            {booking.nailArtistName
              ? `Artist: ${booking.nailArtistName}`
              : `Shop: ${booking.shopName}`}
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

        <div className="flex items-center justify-between pt-4 border-t border-slate-50 gap-3">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase leading-none">
              Total
            </span>
            <span className="text-lg font-black text-green-500 leading-tight">
              {Number(booking.totalPrice).toLocaleString()}{" "}
              <span className="text-[10px]">VND</span>
            </span>
          </div>

          <div className="flex gap-2">
            {isShopOwner && (
              <>
                {booking.status === 0 && (
                  <>
                    <ConfirmationDialog
                      trigger={
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isLoading}
                          className="rounded-xl text-red-400 font-black text-[10px] uppercase border border-red-300 hover:bg-red-400 hover:text-white"
                        >
                          {isLoading ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          ) : null}
                          Reject
                        </Button>
                      }
                      {...statusConfig.reject}
                      onConfirm={() => onReject?.(booking.id)}
                      isLoading={isLoading}
                    />

                    <ConfirmationDialog
                      trigger={
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isLoading}
                          className="rounded-xl text-emerald-400 font-black text-[10px] uppercase border border-green-300 hover:bg-green-400 hover:text-white"
                        >
                          {isLoading ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          ) : null}
                          Approve
                        </Button>
                      }
                      {...statusConfig.approve}
                      onConfirm={() => onApprove?.(booking.id)}
                      isLoading={isLoading}
                    />
                  </>
                )}

                {booking.status === 1 && (
                  <>
                    <ConfirmationDialog
                      trigger={
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isLoading}
                          className="rounded-xl text-red-400 font-black text-[10px] uppercase border border-red-300 hover:bg-red-400 hover:text-white"
                        >
                          {isLoading ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          ) : null}
                          Cancel
                        </Button>
                      }
                      {...statusConfig.cancel}
                      onConfirm={() => onCancel?.(booking.id)}
                      isLoading={isLoading}
                    />

                    <ConfirmationDialog
                      trigger={
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isLoading}
                          className="rounded-xl text-emerald-400 font-black text-[10px] uppercase border border-green-300 hover:bg-green-400 hover:text-white"
                        >
                          {isLoading ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          ) : null}
                          Complete
                        </Button>
                      }
                      {...statusConfig.complete}
                      onConfirm={() => onComplete?.(booking.id)}
                      isLoading={isLoading}
                    />
                  </>
                )}
              </>
            )}

            {!isShopOwner && booking.status === 0 && (
              <ConfirmationDialog
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-[2rem] text-red-400 font-black text-[10px] uppercase border border-red-300 hover:bg-red-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                }
                {...statusConfig.cancel}
                onConfirm={() => onCancel?.(booking.id)}
              />
            )}

            {!isShopOwner && booking.status === 3 && !booking.ratings && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/booking/rating/${booking.id}`)}
                className="rounded-[2rem] text-blue-400 font-black text-[10px] uppercase border border-blue-300 hover:bg-blue-400 hover:text-white"
              >
                Rate
              </Button>
            )}

            <Button
              size="sm"
              onClick={() => navigate(`/booking/detail/${booking.id}`)}
              className="flex h-9 w-24 rounded-[2rem] font-black uppercase text-[10px] text-white shadow-xl shadow-pink-100"
              style={{
                background: "linear-gradient(90deg, #FFC988 0%, #f988b3 100%)",
              }}
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
