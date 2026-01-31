"use client";

import { useAuthContext } from "@/components/auth/AuthProvider";
import MobileLayout from "@/components/layout/MobileLayout";
import { useNailArtist } from "@/hooks/useNailArtist";
import { useBookings } from "@/hooks/useBookings";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatMini } from "@/components/ui/stat-mini";
import { ActionButton } from "@/components/ui/action-button";
import {
  Loader2,
  User,
  Calendar,
  Star,
  TrendingUp,
  Briefcase,
  ChevronRight,
  PlusCircle,
  LayoutDashboard,
} from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";
import { BookingStatusBadge } from "@/components/badge/BookingStatusBadge";
import Header from "@/components/ui/header";
const NailArtistDashboardPage = () => {
  const { user, loading } = useAuthContext();
  const { myArtist, artistLoading, createArtist } = useNailArtist();
  const { useArtistBookings } = useBookings();
  const { data: bookings } = useArtistBookings(myArtist?.id);
  const navigate = useNavigate();

  if (loading || artistLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-slate-500 mt-4 font-medium">Opening Dashboard...</p>
      </div>
    );
  }

  if (user?.role !== 4) return <Navigate to="/" replace />;

  const pendingBookings =
    bookings?.filter((b) => b.status === "pending").length || 0;
  const todayDate = new Date().toISOString().split("T")[0];
  const todayBookings =
    bookings?.filter((b) => b.booking_date === todayDate).length || 0;
  const completedBookings =
    bookings?.filter((b) => b.status === "completed").length || 0;

  if (!myArtist) {
    return (
      <MobileLayout>
        <Header title="Nailify" hasNotification={true} />

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
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <Header title="Nailify" hasNotification={true} />

      <div className="min-h-screen bg-slate-50/50 pb-24">
        <div className="bg-white px-6 pt-8 pb-6 border-b shadow-sm">
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
                  <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <User className="w-7 h-7" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Welcome back,
                </p>
                <h1 className="text-xl font-bold text-slate-900 leading-tight">
                  {myArtist.fullName}
                </h1>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10"
              onClick={() => navigate("/my-artist")}
            >
              <LayoutDashboard className="w-5 h-5 text-slate-600" />
            </Button>
          </div>

          {/* Key Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <StatMini
              label="Today"
              value={todayBookings}
              color="text-blue-600"
              bg="bg-blue-50"
            />
            <StatMini
              label="Pending"
              value={pendingBookings}
              color="text-amber-600"
              bg="bg-amber-50"
            />
            <StatMini
              label="Rating"
              value={myArtist.rating?.toFixed(1) || "New"}
              color="text-purple-600"
              bg="bg-purple-50"
            />
          </div>
        </div>

        <div className="p-5 space-y-8">
          {/* Quick Actions Grid */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 ml-1">
              Business Management
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <ActionButton
                icon={Calendar}
                label="My Schedule"
                sub="View Calendar"
                onClick={() => navigate("/schedule")}
              />
              <ActionButton
                icon={TrendingUp}
                label="Bookings"
                sub={`${pendingBookings} new requests`}
                onClick={() => navigate("/bookings")}
              />
              <ActionButton
                icon={PlusCircle}
                label="Add Service"
                sub="Prices & Items"
                onClick={() => navigate("/my-artist/service-items/create/0")}
              />
              <ActionButton
                icon={User}
                label="Profile"
                sub="Public Studio Page"
                onClick={() => navigate("/my-artist")}
              />
            </div>
          </section>

          {/* Recent Bookings List */}
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Upcoming Appointments
              </h3>
              <Button
                variant="link"
                size="sm"
                className="text-primary font-bold"
                onClick={() => navigate("/bookings")}
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
          </section>
        </div>
      </div>
    </MobileLayout>
  );
};

export default NailArtistDashboardPage;
