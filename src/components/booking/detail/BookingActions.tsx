import { Button } from "@/components/ui/button";
import { XCircle, Calendar, Loader2, CheckCircle, X, Star } from "lucide-react";
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
        {/* SHOP OWNER ACTIONS */}
        {isShopOwner && (
          <>
            {isPending && (
              <>
                <ConfirmationDialog
                  trigger={
                    <Button
                      variant="outline"
                      disabled={isUpdatingStatus}
                      className="h-14 w-14 rounded-2xl border-slate-200 text-slate-400 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all"
                    >
                      {isUpdatingStatus ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <X size={20} />
                      )}
                    </Button>
                  }
                  {...statusConfig.reject}
                  onConfirm={() => onReject?.(booking.id)}
                />
                <ConfirmationDialog
                  trigger={
                    <Button
                      disabled={isUpdatingStatus}
                      className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-green-100 bg-green-500 hover:bg-green-600 text-white"
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
              <>
                <ConfirmationDialog
                  trigger={
                    <Button
                      variant="outline"
                      disabled={isUpdatingStatus || isCancelling}
                      className="h-14 w-14 rounded-2xl border-slate-200 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all"
                    >
                      <XCircle size={20} />
                    </Button>
                  }
                  {...statusConfig.cancel}
                  onConfirm={() => onCancel?.(booking.id)}
                />
                <ConfirmationDialog
                  trigger={
                    <Button
                      disabled={isUpdatingStatus}
                      className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-100 bg-[#88D0F9] hover:bg-[#7bc4ed] text-white"
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
              </>
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
                  className="h-14 rounded-2xl border-red-400 text-red-400 hover:text-white hover:bg-red-400"
                >
                  <XCircle size={20} />
                  Cancel Booking
                </Button>
              }
              {...statusConfig.cancel}
              onConfirm={() => onCancel?.(booking.id)}
            />
            <Button
              className="flex h-14 rounded-2xl font-black uppercase tracking-widest text-xs text-white shadow-xl shadow-pink-100"
              style={{
                background: "linear-gradient(90deg, #FFC988 0%, #f988b3 100%)",
              }}
              onClick={() => onReschedule?.(booking.id)}
            >
              <Calendar className="w-4 h-4 mr-2" /> Reschedule
            </Button>
          </>
        )}

        {/* RATE BUTTON FOR COMPLETED */}
        {!isShopOwner && isCompleted && !booking.ratings && (
          <Button
            onClick={() => navigate(`/booking/rating/${booking.id}`)}
            className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs text-white shadow-xl shadow-pink-100"
            style={{
              background: "linear-gradient(90deg, #FFC988 0%, #f988b3 100%)",
            }}
          >
            <Star className="w-4 h-4 mr-2 fill-white" /> Rate Experience
          </Button>
        )}
      </div>
    </footer>
  );
};
