import { useCustomerInsights } from "@/hooks/useInsight";
import { StatCard } from "../../components/inisght/StatCard";
import { Loader2 } from "lucide-react";
import Header from "@/components/ui/header";
import DateDisplay from "@/components/ui/date-display";
import { dayMapping } from "@/components/inisght/dayMapping";

const CustomerInsight = () => {
  const { data: insights, isLoading, error } = useCustomerInsights();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">Error loading insights</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-[#950101] via-[#D81B60] to-[#FFCFE9] pt-8 pb-10 px-8 rounded-b-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-3xl " />

        <div className="relative z-10 max-w-4xl mx-auto text-white">
          <p className="text-[#FFCFE9] text-sm font-bold uppercase tracking-widest mb-2">
            Hành Trình Sắc Đẹp
          </p>
          <h1 className="text-2xl md:text-4xl font-light">
            Chào mừng quay lại,{" "}
            <span className="font-semibold italic">
              {insights?.customerName || "Member"}
            </span>
            .
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Tổng lịch hẹn"
            value={insights?.totalBookings || 0}
            color="pink"
          />
          <StatCard
            title="Đã hoàn thành"
            value={insights?.completedBookings || 0}
            color="emerald"
          />
          <StatCard
            title="Đã hủy"
            value={insights?.cancelledBookings || 0}
            color="garnet"
          />
          <StatCard
            title="Tổng chi tiêu"
            value={`${insights?.totalSpent ? Number(insights.totalSpent).toLocaleString() : "0"} đ`}
            color="blue"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Engagement Analytics */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-md">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#950101] mb-6 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#950101]" />
                Chi tiêu & Lịch sử
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-slate-50 pb-2">
                    <span className="text-sm font-bold text-slate-400">
                      Trung bình/buổi
                    </span>
                    <span className="text-xl font-black text-slate-900">
                      {insights?.averageSpent?.toLocaleString()}đ
                    </span>
                  </div>
                  <div className="flex justify-between items-end border-b border-slate-50 pb-2">
                    <span className="text-sm font-bold text-slate-400">
                      Ngày đầu trải nghiệm
                    </span>
                    <span className="text-sm font-black text-slate-700">
                      <DateDisplay
                        dateString={insights?.firstBookingDate}
                        isIcon={false}
                      />
                    </span>
                  </div>
                  <div className="flex justify-between items-end border-b border-slate-50 pb-2">
                    <span className="text-sm font-bold text-slate-400">
                      Buổi gần nhất
                    </span>
                    <span className="text-sm font-black text-slate-700">
                      <DateDisplay
                        dateString={insights?.lastBookingDate}
                        isIcon={false}
                      />
                    </span>
                  </div>
                  <div className="flex justify-between items-end border-b border-slate-50 pb-2">
                    <span className="text-sm font-bold text-slate-400">
                      Tần suất đặt lịch
                    </span>
                    <span className="text-sm font-black text-slate-700">
                      {insights?.averageDaysBetweenBookings?.toFixed(1) || "0"}{" "}
                      Ngày
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Preferences Section */}
            <section className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-md">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#950101] mb-6">
                Phong cách yêu thích
              </h3>
              <div className="flex flex-wrap gap-2">
                {insights?.preferredCollections?.map((service, index) => (
                  <span
                    key={index}
                    className="bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider border border-slate-100"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* The Favorites Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#950101] to-[#FFCFE9] p-6 rounded-[2.5rem] text-white space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
                Nghệ sĩ ưu tiên
              </h3>

              {/* Preferred Artist Profile */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/20">
                    {insights.artistAvatar ? (
                      <img
                        src={insights.artistAvatar}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/10 flex items-center justify-center font-black">
                        {insights.artistName?.[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#FFCFE9]">
                      Nghệ sĩ yêu thích
                    </p>
                    <p className="font-bold text-lg leading-tight">
                      {insights?.artistName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/20">
                    {insights.shopAvatar ? (
                      <img
                        src={insights.shopAvatar}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/10 flex items-center justify-center font-black">
                        {insights.shopName?.[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#FFCFE9]">
                      Tiệm quen thuộc
                    </p>
                    <p className="font-bold text-lg leading-tight">
                      {insights?.shopName}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Preference Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-md space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Khung giờ vàng
                </p>
                <p className="text-xl font-black text-slate-900">
                  {insights?.preferredTimeOfDay || "Anytime"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Ngày hay đặt nhất
                </p>
                <p className="text-xl font-black text-slate-900">
                  {dayMapping[insights?.preferredDayOfWeek] ||
                    insights?.preferredDayOfWeek ||
                    "Linh hoạt"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInsight;
