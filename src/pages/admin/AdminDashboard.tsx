import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import { Loader2, Sparkles, LayoutDashboard } from "lucide-react";
import FourWidgets from "@/components/admin/dashboard/FourWidgets";
import TopShops from "@/components/admin/dashboard/TopShops";
import TopArtists from "@/components/admin/dashboard/TopArtists";
import CustomerGrowth from "@/components/admin/dashboard/CustomerGrowth";
import RatingsBreakdown from "@/components/admin/dashboard/RatingsBreakdown";

const AdminDashboard = () => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-[#950101]" />
      </div>
    );
  }

  if (!user || user?.role !== 2) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto max-w-[1600px] space-y-12 animate-in fade-in duration-700">

      {/* Editorial Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-100">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-[2px] bg-[#950101]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#950101] flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> Tổng quan hệ thống 2026
            </span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase leading-none">
            Bảng <span className="text-[#950101]">Điều Khiển</span>
          </h1>
          <p className="text-sm font-bold text-slate-400 italic mt-4 max-w-xl">
            Chào mừng trở lại, Quản Trị Viên. Theo dõi nhịp đập của hệ thống,
            tăng trưởng doanh thu và hiệu suất của các đối tác nghệ sĩ.
          </p>
        </div>

        {/* Quick Date Badge */}
        <div className="hidden lg:flex flex-col items-end">
          <div className="px-4 py-2 bg-slate-900 rounded-2xl shadow-xl shadow-slate-200">
            <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">
              {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="space-y-10">

        {/* Top Tier: Key Metrics */}
        <section>
          <FourWidgets />
        </section>

        {/* Second Tier: Analytics & Growth */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border-2 border-slate-50 p-2 shadow-sm">
            <CustomerGrowth />
          </div>
          <div className="bg-white rounded-[2.5rem] border-2 border-slate-50 p-2 shadow-sm">
            <RatingsBreakdown />
          </div>
        </div>

        {/* Third Tier: Leaders & Partners */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-4">
              <LayoutDashboard className="w-5 h-5 text-[#950101]" />
              <h2 className="text-lg font-black uppercase tracking-widest text-slate-800">Top Cửa Hàng</h2>
            </div>
            <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-2 overflow-hidden transition-all hover:border-[#950101]/20">
              <TopShops />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 px-4">
              <Sparkles className="w-5 h-5 text-[#950101]" />
              <h2 className="text-lg font-black uppercase tracking-widest text-slate-800">Nghệ Sĩ Tiêu Biểu</h2>
            </div>
            <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-2 overflow-hidden transition-all hover:border-[#950101]/20">
              <TopArtists />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;