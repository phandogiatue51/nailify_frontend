// @/pages/booking/CreateRatingPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookingAPI } from "@/services/api";
import BookingCard from "@/components/booking/BookingCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useState } from "react";
import { useCreateRating } from "@/hooks/useRatings";
import { useToast } from "@/hooks/use-toast";

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

  if (isLoading) return <div>Loading...</div>;
  if (!booking) return <div>Booking not found</div>;

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Đánh giá dịch vụ</h1>

      <BookingCard booking={booking} isShopOwner={false} />

      <div className="space-y-4 border rounded-lg p-6">
        <h2 className="font-semibold">Chất lượng dịch vụ</h2>

        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none"
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hover || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Nhận xét (không bắt buộc)
          </label>
          <Textarea
            placeholder="Chia sẻ trải nghiệm của bạn..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/profile/bookings")}
          >
            Bỏ qua
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={createRating.isPending}
          >
            {createRating.isPending ? "Đang gửi..." : "Gửi đánh giá"}
          </Button>
        </div>
      </div>
    </div>
  );
}
