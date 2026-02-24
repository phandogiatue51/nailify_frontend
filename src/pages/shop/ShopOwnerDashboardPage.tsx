import { useAuthContext } from "@/components/auth/AuthProvider";
import { useShop } from "@/hooks/useShop";
import { useBookings } from "@/hooks/useBookings";
import QuickStats from "@/components/QuickStats";
import { Button } from "@/components/ui/button";
import { Loader2, Store, Sparkles, ChevronRight, Users, HeartHandshake, Globe } from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";
import Header from "@/components/ui/header";
import { Card, CardContent } from "@/components/ui/card";
import { BookingStatusBadge } from "@/components/badge/BookingStatusBadge";
const ShopOwnerDashboardPage = () => {
  const { user, loading } = useAuthContext();
  const { myShop, shopLoading } = useShop();
  const { shopAuthBookings } = useBookings();
  const navigate = useNavigate();
  const bookings = shopAuthBookings;

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
      <div>
        <Header title="Nailify" hasNotification={true} />

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
      </div>
    );
  }

  return (
    <div>
      <Header title="Nailify" hasNotification={true} />

      <div className="p-6 space-y-8 bg-slate-50/30 min-h-screen">
        {/* Header Section */}
        <div className="pt-4 flex justify-between items-end">
          <div className="space-y-1">
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

        <div>
          <QuickStats compact shopId={myShop?.id} period="today" />
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
            Management
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/my-shop")}
              className="w-full flex items-center justify-between p-5 bg-white rounded-3xl border border-slate-50 shadow-sm active:scale-[0.98] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center group-hover:bg-[#FFC988] transition-colors">
                  <Store className="w-6 h-6 text-[#FFC988] group-hover:text-white" />
                </div>
                <div className="text-left">
                  <p className="text-[12px] font-black uppercase tracking-widest text-slate-400">
                    My Shop
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/staff-management")}
              className="w-full flex items-center justify-between p-5 bg-white rounded-3xl border border-slate-50 shadow-sm active:scale-[0.98] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center group-hover:bg-[#E288F9] transition-colors">
                  <Users className="w-6 h-6 text-[#E288F9] group-hover:text-white" />
                </div>
                <div className="text-left">
                  <p className="text-[12px] font-black uppercase tracking-widest text-slate-400">
                    Managers
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/blog/my-blog")}
              className="w-full flex items-center justify-between p-5 bg-white rounded-3xl border border-slate-50 shadow-sm active:scale-[0.98] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center group-hover:bg-blue-400 transition-colors">
                  <Globe className="w-6 h-6 text-blue-500 group-hover:text-white" />
                </div>
                <div className="text-left">
                  <p className="text-[12px] font-black uppercase tracking-widest text-slate-400">
                    Posts
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/subscription/my-subscription")}
              className="w-full flex items-center justify-between p-5 bg-white rounded-3xl border border-slate-50 shadow-sm active:scale-[0.98] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center group-hover:bg-red-400 transition-colors">
                  <HeartHandshake className="w-6 h-6 text-red-500 group-hover:text-white" />
                </div>
                <div className="text-left">
                  <p className="text-[12px] font-black uppercase tracking-widest text-slate-400">
                    Package
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Upcoming Appointments
          </h3>
          <Button
            variant="link"
            size="sm"
            className="text-primary font-bold"
            onClick={() => navigate("/shop/bookings")}
          >
            See All
          </Button>
        </div>

        <Card className="border-none shadow-sm ring-1 ring-slate-200 overflow-hidden">
          <CardContent className="p-0 divide-y">
            {bookings && bookings.length > 0 ? (
              bookings.slice(0, 4).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 active:bg-slate-50 transition-colors"
                >
                  <div className="flex flex-col gap-1">
                    <p className="font-bold text-slate-900">
                      {booking.customerName}
                    </p>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-tight">
                      {booking.serviceName}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookingStatusBadge status={booking.status} />
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm">
                No bookings found yet.
              </div>
            )}
          </CardContent>
        </Card>

        <Button
          className="font-black tracking-tight uppercase text-lg rounded-[2rem] w-full h-12"
          style={{
            background:
              "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
            border: "none",
          }}
          onClick={() => navigate("/booking/guest")}
        >
          Book an appointment
        </Button>
      </div>
    </div>
  );
};

export default ShopOwnerDashboardPage;
