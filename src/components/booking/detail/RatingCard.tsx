import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Star, MessageSquare } from "lucide-react";
export const RatingCard = ({
  ratings,
  comment,
}: {
  ratings: number | null;
  comment: string | null;
}) => {
  if (!ratings) return null;

  return (
    <Card className="border-none shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-[2rem] bg-gradient-to-br from-white to-slate-50/50 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
          <Star className="w-4 h-4 text-[#FFC988] " />
          Đánh giá từ khách hàng
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Star Display */}
        <div className="flex gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < ratings
                  ? "text-[#FFC988] fill-[#FFC988]"
                  : "text-slate-200 fill-slate-100"
              }`}
            />
          ))}
        </div>

        {/* Comment Box */}
        {comment ? (
          <div className="relative p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <MessageSquare className="absolute -top-2 -right-2 w-8 h-8 text-slate-50" />
            <p className="text-sm font-medium text-slate-600 italic leading-relaxed relative z-10">
              "{comment}"
            </p>
          </div>
        ) : (
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">
            Không có bình luận từ đánh giá
          </p>
        )}
      </CardContent>
    </Card>
  );
};
