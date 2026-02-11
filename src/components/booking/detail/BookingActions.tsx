import { Button } from "@/components/ui/button";
import { XCircle, Calendar, Loader2, CheckCircle, X } from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { getStatusConfig } from "@/components/booking-status-config";

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
  const isFuture = new Date(booking?.scheduledStart) > new Date();

  const statusConfig = getStatusConfig(booking.status, isShopOwner);

  return (
    <footer className="sticky bottom-0 inset-x-0 backdrop-blur-xl border-t border-slate-100 p-6 z-40">
      <div className="max-w-4xl mx-auto flex gap-3">
        {isShopOwner && (
          <>
            {isPending && (
              <>
                {/* REJECT with ConfirmationDialog */}
                <ConfirmationDialog
                  trigger={
                    <Button
                      variant="outline"
                      disabled={isUpdatingStatus}
                      className="flex-1 rounded-2xl font-bold border-red-200 text-red-600 hover:bg-red-50"
                    >
                      {isUpdatingStatus ? (
                        <Loader2 className="animate-spin mr-2" size={16} />
                      ) : (
                        <X className="mr-2" size={16} />
                      )}
                      Reject
                    </Button>
                  }
                  {...statusConfig.reject}
                  onConfirm={() => onReject?.(booking.id)}
                  isLoading={isUpdatingStatus}
                />

                {/* APPROVE with ConfirmationDialog */}
                <ConfirmationDialog
                  trigger={
                    <Button
                      disabled={isUpdatingStatus}
                      className="flex-1 rounded-2xl font-bold bg-green-500 hover:bg-green-600 text-white"
                    >
                      {isUpdatingStatus ? (
                        <Loader2 className="animate-spin mr-2" size={16} />
                      ) : (
                        <CheckCircle className="mr-2" size={16} />
                      )}
                      Approve
                    </Button>
                  }
                  {...statusConfig.approve}
                  onConfirm={() => onApprove?.(booking.id)}
                  isLoading={isUpdatingStatus}
                />
              </>
            )}

            {isApproved && (
              <>
                {/* CANCEL with ConfirmationDialog */}
                <ConfirmationDialog
                  trigger={
                    <Button
                      variant="outline"
                      disabled={isUpdatingStatus || isCancelling}
                      className="flex-1 rounded-2xl font-bold border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                    >
                      {isUpdatingStatus || isCancelling ? (
                        <Loader2 className="animate-spin mr-2" size={16} />
                      ) : (
                        <XCircle className="mr-2" size={16} />
                      )}
                      Cancel
                    </Button>
                  }
                  {...statusConfig.cancel}
                  onConfirm={() => onCancel?.(booking.id)}
                  isLoading={isUpdatingStatus || isCancelling}
                />

                {/* COMPLETE with ConfirmationDialog */}
                <ConfirmationDialog
                  trigger={
                    <Button
                      disabled={isUpdatingStatus}
                      className="flex-1 rounded-2xl font-bold border border-green-400 bg-white text-green-400 hover:bg-green-400 hover:text-white"
                    >
                      {isUpdatingStatus ? (
                        <Loader2 className="animate-spin mr-2" size={16} />
                      ) : (
                        <CheckCircle className="mr-2" size={16} />
                      )}
                      Complete
                    </Button>
                  }
                  {...statusConfig.complete}
                  onConfirm={() => onComplete?.(booking.id)}
                  isLoading={isUpdatingStatus}
                />
              </>
            )}
          </>
        )}

        {/* Customer Actions */}
        {!isShopOwner && isPending && (
          <>
            {isFuture && (
              <Button
                variant="outline"
                className="flex-1 rounded-2xl font-bold"
                onClick={() => onReschedule?.(booking.id)}
              >
                <Calendar className="w-4 h-4 mr-2" /> Reschedule
              </Button>
            )}

            {/* Customer CANCEL with ConfirmationDialog */}
            <ConfirmationDialog
              trigger={
                <Button
                  variant="outline"
                  disabled={isUpdatingStatus || isCancelling}
                  className="flex-1 rounded-2xl font-bold border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                >
                  {isUpdatingStatus || isCancelling ? (
                    <Loader2 className="animate-spin mr-2" size={16} />
                  ) : (
                    <XCircle className="mr-2" size={16} />
                  )}
                  Cancel
                </Button>
              }
              {...statusConfig.cancel}
              onConfirm={() => onCancel?.(booking.id)}
              isLoading={isUpdatingStatus || isCancelling}
            />
          </>
        )}
      </div>
    </footer>
  );
};
