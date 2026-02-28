import { Button } from "@/components/ui/button";
import { XCircle, Calendar, Loader2, CheckCircle, X, Star, UserCog } from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { getStatusConfig } from "@/components/booking-status-config";
import { useNavigate } from "react-router-dom";
interface BookingActionsProps {
  booking: any;
  onCancel?: (bookingId: string) => void;
  onReschedule?: (bookingId: string) => void;
  onApprove?: (bookingId: string) => void;
  onReject?: (bookingId: string) => void;
  onComplete?: (bookingId: string) => void;
  isCancelling: boolean;
  isUpdatingStatus?: boolean;
  navigate: any;
  isShopOwner?: boolean;
}
export const BookingActions = ({
  booking,
  onCancel,
  onReschedule,
  onApprove,
  onReject,
  onComplete,
  isCancelling,
  isUpdatingStatus = false,
  isShopOwner = false,
}: BookingActionsProps) => {
  const isPending = booking?.status === 0;
  const isApproved = booking?.status === 1;
  const isCompleted = booking?.status === 3;
  const isFuture = new Date(booking?.scheduledStart) > new Date();
  const navigate = useNavigate();
  const statusConfig = getStatusConfig(booking.status, isShopOwner);

  return (
    <footer className="sticky bottom-0 inset-x-0 z-40">
      <div className="max-w-md mx-auto flex items-center justify-center gap-3">
        {isShopOwner && (
          <>
            {isPending && (
              <>
                <ConfirmationDialog
                  trigger={
                    <Button
                      variant="outline"
                      disabled={isUpdatingStatus}
                      className="flex-1 h-14 rounded-2xl border-red-300 text-red-300 hover:bg-red-400 hover:text-white font-black uppercase transition-all"
                    >
                      {isUpdatingStatus ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <X size={20} />
                      )}
                      Cancel Booking
                    </Button>
                  }
                  {...statusConfig.reject}
                  onConfirm={() => onReject?.(booking.id)}
                />
                <ConfirmationDialog
                  trigger={
                    <Button
                      disabled={isUpdatingStatus}
                      className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-green-100 bg-green-300 hover:bg-green-600 text-white"
                    >
                      {isUpdatingStatus ? (
                        <Loader2 className="animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="mr-2" size={18} />
                      )}
                      Approve Booking
                    </Button>
                  }
                  {...statusConfig.approve}
                  onConfirm={() => onApprove?.(booking.id)}
                />
              </>
            )}

            {isApproved && (
              <div className="flex flex-col gap-3 w-full">
                {/* 1. The Primary Success Action */}
                <ConfirmationDialog
                  trigger={
                    <Button
                      disabled={isUpdatingStatus}
                      className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-green-100 bg-green-300 hover:bg-green-500 text-white flex items-center justify-center transition-all active:scale-[0.98]"
                    >
                      {isUpdatingStatus ? (
                        <Loader2 className="animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="mr-2" size={18} />
                      )}
                      Mark Complete
                    </Button>
                  }
                  {...statusConfig.complete}
                  onConfirm={() => onComplete?.(booking.id)}
                />

                {/* 2. Secondary Utility Row */}
                <div className="flex gap-3">
                  <ConfirmationDialog
                    trigger={
                      <Button
                        variant="outline"
                        disabled={isUpdatingStatus || isCancelling}
                        className="flex-1 h-12 rounded-xl border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px] text-rose-300 border-rose-300 hover:bg-rose-400 hover:text-white"
                      >
                        <XCircle className="mr-2" size={14} />
                        Cancel Booking
                      </Button>
                    }
                    {...statusConfig.cancel}
                    onConfirm={() => onCancel?.(booking.id)}
                  />

                  {!booking.customerId && (
                    <Button
                      variant="outline"
                      disabled={isUpdatingStatus}
                      onClick={() => navigate(`/booking/update-guest/${booking.id}`)}
                      className="flex-1 h-12 rounded-xl border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px] text-blue-300 border-blue-300 hover:bg-blue-400 hover:text-white"
                    >
                      <UserCog className="mr-2" size={14} />
                      Edit Guest Info
                    </Button>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* CUSTOMER ACTIONS */}
        {!isShopOwner && isPending && (
          <>
            <ConfirmationDialog
              trigger={
                <Button
                  variant="outline"
                  disabled={isUpdatingStatus || isCancelling}
                  className="h-10 rounded-2xl border-red-400 text-red-400 hover:text-white hover:bg-red-400 font-black uppercase tracking-widest text-xs shadow-xl"
                >
                  <XCircle size={20} />
                  Cancel Booking
                </Button>
              }
              {...statusConfig.cancel}
              onConfirm={() => onCancel?.(booking.id)}
            />
            {isFuture && (
              <Button
                className="flex h-10 rounded-2xl font-black uppercase tracking-widest text-xs text-white shadow-xl shadow-pink-100"
                style={{
                  background:
                    "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
                }}
                onClick={() => onReschedule?.(booking.id)}
              >
                <Calendar className="w-4 h-4 mr-2" /> Reschedule
              </Button>
            )}
          </>
        )}

        {/* RATE BUTTON FOR COMPLETED */}
        {!isShopOwner && isCompleted && !booking.ratings && (
          <Button
            onClick={() => navigate(`/booking/rating/${booking.id}`)}
            className="w-full h-10 rounded-2xl font-black uppercase tracking-widest text-xs text-white shadow-xl shadow-pink-100"
            style={{
              background:
                "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
            }}
          >
            <Star className="w-4 h-4 mr-2 fill-white" /> Rate Experience
          </Button>
        )}
      </div>
    </footer>
  );
};
