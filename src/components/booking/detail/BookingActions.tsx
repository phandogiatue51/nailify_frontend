import { Button } from "@/components/ui/button";
import { XCircle, Calendar, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const BookingActions = ({
  booking,
  onCancel,
  onReschedule,
  isCancelling,
  navigate,
}: any) => {
  const isPending = booking?.status === 0;
  const isFuture = new Date(booking?.scheduledStart) > new Date();

  return (
    <footer className="fixed bottom-0 inset-x-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 p-6 z-40">
      <div className="max-w-4xl mx-auto flex gap-3">
        <Button
          variant="outline"
          className="flex-1 rounded-2xl border-slate-200 font-bold"
          onClick={() => navigate("/bookings")}
        >
          Back
        </Button>

        {isPending && isFuture && (
          <>
            <Button
              variant="outline"
              className="flex-1 rounded-2xl font-bold"
              onClick={onReschedule}
            >
              <Calendar className="w-4 h-4 mr-2" /> Reschedule
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex-1 rounded-2xl font-bold bg-red-50 text-red-600 hover:bg-red-100 border-none shadow-none"
                >
                  {isCancelling ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Cancel"
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-[2rem] border-none">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-black">
                    Cancel Appointment?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will release your time slot. This action cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl font-bold">
                    Keep it
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onCancel}
                    className="rounded-xl font-bold bg-red-500 hover:bg-red-600"
                  >
                    Confirm Cancellation
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </footer>
  );
};
