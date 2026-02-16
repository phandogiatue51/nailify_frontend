import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookingAPI } from "@/services/api";
import BookingCard from "@/components/booking/BookingCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, ArrowLeft, Heart } from "lucide-react";
import { useState } from "react";
import { useCreateRating } from "@/hooks/useRatings";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function CreateRatingPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const createRating = useCreateRating();

  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      if (!bookingId) return null;
      return await BookingAPI.getById(bookingId);
    },
    enabled: !!bookingId,
  });

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        description: "Vui lòng chọn số sao",
        variant: "destructive",
      });
      return;
    }

    await createRating.mutateAsync(
      {
        bookingId: bookingId!,
        dto: {
          rating,
          comment: comment.trim() || null,
        },
      },
      {
        onSuccess: () => {
          navigate("/profile/bookings");
        },
      },
    );
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center font-black text-slate-400 uppercase tracking-widest">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header aligned with your other pages */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b px-4 py-4 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-xl"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="font-black tracking-tighter uppercase text-xl bg-gradient-to-r from-[#950101] to-[#ffcfe9] bg-clip-text text-transparent">
            Rate Experience
          </h1>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-6">
        {/* Booking Context */}
        <div className="opacity-80 scale-[0.98]">
          <BookingCard booking={booking} isShopOwner={false} />
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-pink-50 rounded-2xl mb-2">
              <Heart className="w-6 h-6 text-[#f988b3] fill-[#f988b3]" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">
              How was your service?
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Your feedback helps us improve
            </p>
          </div>

          {/* Large Star Input */}
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-transform active:scale-90"
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={cn(
                    "w-10 h-10 transition-all duration-200",
                    star <= (hover || rating)
                      ? "fill-[#FFC988] text-[#FFC988] scale-110"
                      : "text-slate-100 fill-slate-50",
                  )}
                />
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Share your thoughts (optional)
              </h3>
            </div>
            <Textarea
              placeholder="Tell us about the artist, the atmosphere, or your new nails..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[120px] rounded-[1.5rem] border-slate-100 bg-slate-50 focus:bg-white transition-all p-4 text-sm font-medium resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-xs border-slate-100 text-slate-400"
              onClick={() => navigate("/profile/bookings")}
            >
              Skip
            </Button>
            <Button
              className="flex-[2] h-14 rounded-2xl font-black uppercase tracking-widest text-xs text-white shadow-lg active:scale-95 disabled:opacity-50"
              style={{
                background:
                  "linear-gradient(90deg, #950101 0%, #ffcfe9 100%)",
                border: "none",
              }}
              onClick={handleSubmit}
              disabled={createRating.isPending || rating === 0}
            >
              {createRating.isPending ? "Sending..." : "Submit Review"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
