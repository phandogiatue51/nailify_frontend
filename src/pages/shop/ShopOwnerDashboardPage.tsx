import { useAuthContext } from "@/components/auth/AuthProvider";
import MobileLayout from "@/components/layout/MobileLayout";
import { useShop } from "@/hooks/useShop";
import { useBookings } from "@/hooks/useBookings";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Store,
  Calendar,
  TrendingUp,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";

const ShopOwnerDashboardPage = () => {
  const { user, loading } = useAuthContext();
  const { myShop, shopLoading } = useShop();
  const { useShopBookings } = useBookings();
  const { data: bookings } = useShopBookings(myShop?.id);
  const navigate = useNavigate();

  if (loading || shopLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#E288F9]" />
      </div>
    );
  }

  if (user?.role !== 1) return <Navigate to="/" replace />;

  if (!myShop) {
    return (
      <MobileLayout>
        <div className="p-8 flex flex-col items-center justify-center min-h-[80vh] text-center space-y-6">
          <div className="w-24 h-24 bg-slate-50 rounded-[3rem] flex items-center justify-center shadow-inner">
            <Store className="w-10 h-10 text-slate-300" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Start Your Journey
            </h2>
            <p className="text-slate-500 mt-2 max-w-[240px] mx-auto">
              Set up your professional nail studio and start accepting bookings
              today.
            </p>
          </div>
          <Button
            onClick={() => navigate("/my-shop")}
            className="w-full max-w-xs h-14 rounded-2xl bg-gradient-to-r from-[#FFC988] to-[#E288F9] text-white font-black border-none shadow-lg shadow-purple-100"
          >
            CREATE YOUR SHOP
          </Button>
        </div>
      </MobileLayout>
    );
  }

  const pendingBookings =
    bookings?.filter((b) => b.status === "pending").length || 0;
  const todayDate = new Date().toISOString().split("T")[0];
  const todayBookings =
    bookings?.filter((b) => b.booking_date === todayDate).length || 0;

  return (
    <MobileLayout>
      <div className="p-6 space-y-8 bg-slate-50/30 min-h-screen pb-24">
        {/* Header Section */}
        <div className="pt-4 flex justify-between items-end">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#E288F9]">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Artist Portal
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-tighter">
              {myShop.name}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center">
            <Store className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="rounded-[2.5rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-[#FFC988] mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Today
                </span>
              </div>
              <p className="text-4xl font-black text-slate-900 tracking-tighter">
                {todayBookings}
              </p>
              <div className="mt-2 h-1 w-8 bg-[#FFC988] rounded-full" />
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-[#E288F9] mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Pending
                </span>
              </div>
              <p className="text-4xl font-black text-slate-900 tracking-tighter">
                {pendingBookings}
              </p>
              <div className="mt-2 h-1 w-8 bg-[#E288F9] rounded-full" />
            </CardContent>
          </Card>
        </div>

        {/* Navigation Actions */}
        <div className="space-y-3">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
            Management
          </h3>

          <button
            onClick={() => navigate("/my-shop")}
            className="w-full flex items-center justify-between p-5 bg-white rounded-3xl border border-slate-50 shadow-sm active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center group-hover:bg-[#FFC988] transition-colors">
                <Store className="w-6 h-6 text-[#FFC988] group-hover:text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900 text-sm">My Shop</p>
                <p className="text-[10px] text-slate-400 font-medium">
                  Services, Collections, Locations
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </button>

          <button
            onClick={() => navigate("/schedule")}
            className="w-full flex items-center justify-between p-5 bg-white rounded-3xl border border-slate-50 shadow-sm active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center group-hover:bg-[#E288F9] transition-colors">
                <Calendar className="w-6 h-6 text-[#E288F9] group-hover:text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900 text-sm">Schedule</p>
                <p className="text-[10px] text-slate-400 font-medium">
                  Manage bookings & timing
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ShopOwnerDashboardPage;
