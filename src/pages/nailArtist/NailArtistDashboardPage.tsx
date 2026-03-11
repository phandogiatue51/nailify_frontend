"use client";

import { useAuthContext } from "@/components/auth/AuthProvider";
import { useNailArtist } from "@/hooks/useNailArtist";
import { useBookings } from "@/hooks/useBookings";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QuickStats from "@/components/QuickStats";
import {
  Loader2,
  User,
  Briefcase,
  ChevronRight,
  LayoutDashboard,
  Globe,
  HeartHandshake,
  Gem,
  Wallet,
} from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";
import { BookingStatusBadge } from "@/components/badge/BookingStatusBadge";
import Header from "@/components/ui/header";
const NailArtistDashboardPage = () => {
  const { user, loading } = useAuthContext();
  const { myArtist, artistLoading, createArtist } = useNailArtist();
  const { artistAuthBookings } = useBookings();
  const navigate = useNavigate();
  const bookings = artistAuthBookings;

  if (loading || artistLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (user?.role !== 4) return <Navigate to="/" replace />;

  if (!myArtist) {
    return (
      <div>
        <Header title="Nailify" />

        <div className="p-8 flex flex-col items-center justify-center min-h-[80vh] text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Briefcase className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Become an Artist</h2>
          <p className="text-slate-500 mb-8 max-w-xs">
            Showcase your talent and start managing your nail salon business
            today.
          </p>
          <Button
            size="lg"
            className="w-full rounded-xl h-12 text-base font-bold"
            onClick={() => createArtist.mutateAsync()}
            disabled={createArtist.isPending}
          >
            {createArtist.isPending ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              "Set Up My Studio"
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Nailify" />

      <div className="min-h-screen bg-slate-50/50 px-6 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              {myArtist.avatarUrl ? (
                <img
                  src={myArtist.avatarUrl}
                  alt=""
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/10"
                />
              ) : (
                <div className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/10 bg-gradient-to-br from-[#950101] to-[#FFCFE9] flex items-center justify-center">
                  <span className="text-xl font-bold text-white uppercase">
                    {myArtist.fullName?.[0] || "U"}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Chào mừng trở lại,
              </p>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">
                {myArtist.fullName}
              </h1>
            </div>
          </div>
          <Button
            variant="outline"
            className="rounded-full h-10 px-4 flex items-center gap-2"
            onClick={() => navigate("/my-artist")}
          >
            <LayoutDashboard className="w-5 h-5 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">
              Trang Studio
            </span>
          </Button>
        </div>

        <div>
          <QuickStats compact artistId={myArtist?.id} period="today" />
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 mt-4">
            Quản lý dịch vụ
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/blog/my-blog")}
              className="w-full flex items-center justify-between p-5 bg-white rounded-3xl border border-slate-50 shadow-sm active:scale-[0.98] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center group-hover:bg-blue-400 transition-colors">
                  <Globe className="w-6 h-6 text-blue-500 group-hover:text-white" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Bài đăng
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/subscription")}
              className="w-full flex items-center justify-between p-5 bg-white rounded-3xl border border-slate-50 shadow-sm active:scale-[0.98] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center group-hover:bg-red-400 transition-colors">
                  <HeartHandshake className="w-6 h-6 text-red-500 group-hover:text-white" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Gói đăng ký
                  </p>
                </div>
              </div>
            </button>
            <button
              onClick={() => navigate("/my-subscription")}
              className="w-full flex items-center justify-between p-5 bg-white rounded-3xl border border-slate-50 shadow-sm active:scale-[0.98] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center group-hover:bg-red-400 transition-colors">
                  <Gem className="w-6 h-6 text-purple-500 group-hover:text-white" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Gói đăng ký của tôi
                  </p>
                </div>
              </div>
            </button>
            <button
              onClick={() => navigate("/my-invoice")}
              className="w-full flex items-center justify-between p-5 bg-white rounded-3xl border border-slate-50 shadow-sm active:scale-[0.98] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center group-hover:bg-red-400 transition-colors">
                  <Wallet className="w-6 h-6 text-yellow-500 group-hover:text-white" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Hóa đơn
                  </p>
                </div>
              </div>
            </button>
          </div>

          <div className="flex items-center justify-between mb-4 mt-4 px-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Lịch hẹn sắp tới
            </h3>
            <Button
              variant="link"
              size="sm"
              className="text-primary font-bold"
              onClick={() => navigate("/my-artist/bookings")}
            >
              Xem tất cả
            </Button>
          </div>
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
                Không có lịch hẹn
              </div>
            )}
          </CardContent>
        </Card>
        <Button
          className="font-black tracking-tight uppercase text-lg rounded-[2rem] w-full h-12 mt-6"
          style={{
            background:
              "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
            border: "none",
          }}
          onClick={() => navigate("/booking/guest")}
        >
          Đặt lịch cho khách
        </Button>
      </div>
    </div>
  );
};

export default NailArtistDashboardPage;
