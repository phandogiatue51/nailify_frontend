import { useEffect, useState } from "react";
import { userSubscriptionAPI, subscriptionAPI } from "@/services/api";
import { UserSubscription, Subscription } from "@/types/database";
import {
  Loader2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Zap,
  Star,
  Crown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Header from "@/components/ui/header";

export const MySubscriptionPage = () => {
  const [data, setData] = useState<UserSubscription | null>(null);
  const [plan, setPlan] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullDetails = async () => {
      try {
        setLoading(true);
        const userSub = await userSubscriptionAPI.getAuth();
        setData(userSub);

        if (userSub?.subscriptionPlanId) {
          const planDetails = await subscriptionAPI.getById(
            userSub.subscriptionPlanId,
          );
          setPlan(planDetails);
        }
      } catch (err) {
        console.error("Error fetching subscription details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFullDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#950101]" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Đang đồng bộ dữ liệu...
        </p>
      </div>
    );
  }

  if (!data || !data.isActive) return <NoSubscriptionView />;

  return (
    <div>
      <Header title="Nailify" />

      <div className="p-6 min-h-screen">
        <header>
          <h1
            className="font-black tracking-tight uppercase text-2xl bg-clip-text text-transparent pb-1 text-center"
            style={{
              backgroundImage: plan.colorHex || "#0f172a",
              WebkitBackgroundClip: "text",
            }}
          >
            Gói đăng ký của tôi
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 mb-4 text-center">
            Xem các quyền lợi đến từ gói đăng ký
          </p>
        </header>

        {/* Main Status Card */}
        <Card className="border-2 border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden bg-white">
          <div
            className="p-6 text-white transition-colors duration-500"
            style={{ background: plan?.colorHex || "#0f172a" }}
          >
            <div className="flex justify-between items-start mb-6">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[9px] font-black uppercase tracking-wider">
                {data.isExpired ? "Đã hết hạn" : "Đang hoạt động"}
              </span>
              <ShieldCheck className="w-8 h-8 opacity-50" />
            </div>

            <h2 className="text-4xl font-black uppercase tracking-tighter mb-1 drop-shadow-sm">
              {data.planName}
            </h2>
            <div className="flex items-center gap-2 opacity-70">
              <Clock className="w-3 h-3" />
              <p className="text-[15px] font-bold uppercase tracking-widest">
                Hết hạn:{" "}
                {data.endDate
                  ? new Date(data.endDate).toLocaleDateString("vi-VN")
                  : "N/A"}
              </p>
            </div>
          </div>

          <CardContent className="p-6 space-y-8">
            {/* Days Remaining Pill */}
            <div className="flex items-center justify-between p-4 rounded-3xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#950101]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[12px] font-black text-slate-400 uppercase">
                    Thời gian còn lại
                  </p>
                  <p className="text-lg font-black text-slate-900 leading-none">
                    {data.daysRemaining ?? 0} ngày
                  </p>
                </div>
              </div>
              <Link
                to="/subscriptions"
                className="text-[10px] font-black uppercase text-[#950101] underline underline-offset-4"
              >
                Gia hạn
              </Link>
            </div>

            {/* Plan Limits - Only shown if plan details were fetched */}
            {plan && (
              <div className="space-y-4">
                <h3 className="text-[14px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  Quyền lợi hiện tại
                  <div className="h-px flex-1 bg-slate-100" />
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      label: "Bài đăng/Ngày",
                      val: plan.maxPostsPerDay,
                      icon: <Zap className="w-3 h-3 text-orange-500" />,
                    },
                    {
                      label: "Ảnh/Bài đăng",
                      val: plan.maxImagesPerPost,
                      icon: <Star className="w-3 h-3 text-yellow-500" />,
                    },
                    {
                      label: "Dịch vụ",
                      val: plan.maxServices,
                      icon: <ShieldCheck className="w-3 h-3 text-blue-500" />,
                    },
                    {
                      label: "Bộ sưu tập",
                      val: plan.maxCollections,
                      icon: <Crown className="w-3 h-3 text-purple-500" />,
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm"
                    >
                      <div className="flex items-center justify-center gap-2 mb-2 text-slate-400">
                        {item.icon}
                        <span className="text-[12px] font-black uppercase text-slate-400">
                          {item.label}
                        </span>
                      </div>
                      <p className="text-lg font-black text-slate-900 text-center">
                        {item.val ?? "∞"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Link
              to="/subscriptions"
              style={{
                background: plan.colorHex || "#0f172a",
                boxShadow: `0 10px 20px -5px ${plan.colorHex}66`,
              }}
              className="w-full py-5 text-white rounded-[1.5rem] font-black uppercase text-[12px] tracking-[0.2em] shadow-lg active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
            >
              Nâng cấp gói dịch vụ <ArrowRight className="w-4 h-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const NoSubscriptionView = () => (
  <div>
    <Header title="Nailify" />
    <div className="p-8 flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center mb-6">
        <ShieldCheck className="w-10 h-10 text-slate-300" />
      </div>
      <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 mb-2">
        Chưa có gói đăng ký
      </h2>
      <p className="text-sm text-slate-500 font-medium mb-8 max-w-[250px]">
        Bạn chưa đăng ký gói dịch vụ nào. Hãy chọn một gói để bắt đầu trải
        nghiệm.
      </p>
      <Link
        to="/subscriptions"
        className="px-8 py-4 bg-[#950101] text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-[#950101]/30 active:scale-95 transition-all"
      >
        Xem các gói ngay
      </Link>
    </div>
  </div>
);
