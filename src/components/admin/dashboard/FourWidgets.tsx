// components/admin/dashboard/FourWidgets.tsx
import {
  DollarSign,
  Users,
  FileText,
  Star,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import { useWidgets } from "@/hooks/useAdmin";

const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
  <div className="group relative overflow-hidden bg-white rounded-[2rem] p-7 border-2 border-slate-50 transition-all duration-500 hover:border-[#950101] hover:shadow-2xl hover:shadow-[#950101]/10">
    <div className="flex justify-between items-start">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${color} bg-opacity-10`}>
            <Icon size={18} className="transition-transform" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {title}
          </p>
        </div>

        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            {value}
          </h3>
          <p className="text-[10px] font-bold text-slate-400 italic mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-[#950101]" /> {subtext}
          </p>
        </div>
      </div>
    </div>

    {/* Subtle Decorative Background Gradient */}
    <div
      className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-[0.1] transition-opacity ${color.split(" ")[0]}`}
    />
  </div>
);

const FourWidgets = () => {
  const { data: stats, isLoading, error } = useWidgets();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-40 rounded-[2rem] bg-slate-50 animate-pulse flex items-center justify-center"
          >
            <Loader2 className="w-6 h-6 animate-spin text-slate-200" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 rounded-[2rem] bg-red-50 border-2 border-red-100 text-red-600 font-bold text-center uppercase tracking-widest text-xs">
        Hệ thống gặp lỗi khi tải dữ liệu.
      </div>
    );
  }

  if (!stats) return null;

  return (
    // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    //   <StatCard
    //     title="Doanh Thu Tổng"
    //     value="1,354,000 đ"
    //     icon={DollarSign}
    //     color="bg-[#950101] text-[#950101]"
    //     subtext="Tăng trưởng thực tế"
    //   />
    //   <StatCard
    //     title="Người Dùng"
    //     value="27"
    //     icon={Users}
    //     color="bg-blue-600 text-blue-600"
    //     subtext="Cộng đồng Nailify"
    //   />
    //   <StatCard
    //     title="Hóa Đơn"
    //     value="51"
    //     icon={FileText}
    //     color="bg-orange-500 text-orange-500"
    //     subtext="Giao dịch hệ thống"
    //   />
    //   <StatCard
    //     title="Đánh Giá"
    //     value="34"
    //     icon={Star}
    //     color="bg-purple-600 text-purple-600"
    //     subtext="Chỉ số hài lòng"
    //   />
    // </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Doanh Thu Tổng"
        value={`${stats.totalRevenue.toLocaleString()} đ`}
        icon={DollarSign}
        color="bg-[#950101] text-[#950101]"
        subtext="Tăng trưởng thực tế"
      />
      <StatCard
        title="Người Dùng"
        value={stats.totalUsers.toLocaleString()}
        icon={Users}
        color="bg-blue-600 text-blue-600"
        subtext="Cộng đồng Nailify"
      />
      <StatCard
        title="Hóa Đơn"
        value={stats.totalInvoices.toLocaleString()}
        icon={FileText}
        color="bg-orange-500 text-orange-500"
        subtext="Giao dịch hệ thống"
      />
      <StatCard
        title="Đánh Giá"
        value={stats.totalRates.toLocaleString()}
        icon={Star}
        color="bg-purple-600 text-purple-600"
        subtext="Chỉ số hài lòng"
      />
    </div>
  );
};

export default FourWidgets;
