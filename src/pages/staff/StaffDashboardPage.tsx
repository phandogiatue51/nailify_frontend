"use client";

import { useAuthContext } from "@/components/auth/AuthProvider";
import { useStaff } from "@/hooks/useStaff";
import { useBookings } from "@/hooks/useBookings";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QuickStats from "@/components/QuickStats";
import { Calendar, CheckCircle } from "lucide-react";
import {
  Loader2,
  User,
  Briefcase,
  ChevronRight,
  LayoutDashboard,
  MapPin,
} from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";
import { BookingStatusBadge } from "@/components/badge/BookingStatusBadge";
import Header from "@/components/ui/header";

export const StaffDashboardPage = () => {
  const { user, loading } = useAuthContext();
  const { currentStaff, isCurrentStaffLoading } = useStaff();
  const { staffAuthBookings } = useBookings();
  const navigate = useNavigate();
  const bookings = staffAuthBookings;

  if (loading || isCurrentStaffLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-slate-500 mt-4 font-medium">Opening Dashboard...</p>
      </div>
    );
  }

  if (user?.role !== 3) return <Navigate to="/" replace />;

  return (
    <div>
      <Header title="Nailify" hasNotification={true} />

      <div className="min-h-screen bg-slate-50/50 pb-24 px-6 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              {currentStaff?.avatarUrl ? (
                <img
                  src={currentStaff.avatarUrl}
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
                {currentStaff?.fullName || "Staff Member"}
              </h1>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <QuickStats
            compact
            shopLocationId={currentStaff?.shopLocationId}
            period="today"
          />
        </div>

        {/* If staff have bookings */}
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Today's Appointments
          </h3>
          {bookings && bookings.length > 0 && (
            <Button
              variant="link"
              size="sm"
              className="text-primary font-bold"
              onClick={() => navigate("/staff/schedule")} // Create staff schedule page
            >
              See All
            </Button>
          )}
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
                No appointments scheduled for today.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-16 rounded-2xl flex flex-col items-center justify-center gap-2"
            onClick={() => navigate("/staff/schedule")}
          >
            <Calendar className="w-6 h-6 text-primary" />
            <span className="text-xs font-bold">Schedule</span>
          </Button>

          <Button
            variant="outline"
            className="h-16 rounded-2xl flex flex-col items-center justify-center gap-2"
            onClick={() => navigate("/staff/tasks")}
          >
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="text-xs font-bold">Tasks</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboardPage;
