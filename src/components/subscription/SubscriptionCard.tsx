import { useQuery } from "@tanstack/react-query";
import { subscriptionAPI } from "@/services/api";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  ShieldCheck,
  Zap,
  Star,
  Crown,
  ChevronRight,
} from "lucide-react";
import React from "react";

interface SubscriptionCardProps {
  subscriptionId: string;
  onClose: () => void;
}

const SubscriptionCard = ({ subscriptionId }: SubscriptionCardProps) => {
  const { data: subscription, isLoading } = useQuery({
    queryKey: ["subscription", subscriptionId],
    queryFn: () => subscriptionAPI.getById(subscriptionId),
    enabled: !!subscriptionId,
  });
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate(`/confirm-subscription/${subscriptionId}`)
    console.log("Proceeding to payment for:", subscriptionId);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Đang tải dữ liệu...
        </p>
      </div>
    );
  }

  if (!subscription) return null;

  return (
    <div className="bg-white">
      <div className="p-6 pt-8 space-y-6">
        <div className="relative">
          <div className="absolute -left-2 top-0 bottom-0 w-1 bg-[#950101] rounded-full opacity-20" />
          <p className="pl-4 text-sm text-slate-500 font-medium italic leading-relaxed">
            {subscription.description ||
              "Gói đăng ký tiêu chuẩn với đầy đủ tính năng."}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#950101] flex items-center gap-2">
            <span>Hạn mức tài nguyên</span>
            <div className="h-[1px] flex-1 bg-slate-100" />
          </h3>

          <div className="grid grid-cols-2 gap-3 text-center">
            {[
              {
                label: "Bài đăng",
                val: subscription.maxPostsPerDay,
                icon: <Zap />,
              },
              {
                label: "Hình ảnh",
                val: subscription.maxImagesPerPost,
                icon: <Star />,
              },
              {
                label: "Dịch vụ",
                val: subscription.maxServices,
                icon: <ShieldCheck />,
              },
              {
                label: "Bộ sưu tập",
                val: subscription.maxCollections,
                icon: <Crown />,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-3xl bg-slate-50/50 border border-slate-100 group-hover:bg-white transition-colors"
              >
                <div className="flex items-center justify-center gap-2 mb-2 text-slate-400">
                  {React.cloneElement(item.icon as React.ReactElement, {
                    className: "w-4 h-4",
                  })}
                  <span className="text-[12px] font-black uppercase">
                    {item.label}
                  </span>
                </div>
                <p className="text-2xl font-black text-slate-900 leading-none">
                  {item.val || "∞"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleConfirm}

          style={{
            background: subscription.colorHex || "#0f172a",
            boxShadow: `0 10px 20px -5px ${subscription.colorHex}66`,
          }}
          className="w-full py-5 text-white rounded-[1.5rem] font-black uppercase text-[12px] tracking-[0.2em] shadow-lg active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
        >
          <span className="drop-shadow-md">Nâng cấp ngay</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCard;
