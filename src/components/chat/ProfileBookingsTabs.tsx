"use client";

import { useState, useEffect } from "react";
import { Booking } from "@/types/database";
import { BookingFilterDto } from "@/types/filter";
import { BookingAPI } from "@/services/api";
import BookingCard from "../booking/BookingCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MobilePagination } from "../ui/pagination-mobile";
import { ProfileBookingsTabsProps } from "@/types/props";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
export default function ProfileBookingsTabs({
  profileId,
  shopId,
  nailArtistId,
  userRole,
  userShopId,
  userNailArtistId,
}: ProfileBookingsTabsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const itemsPerPage = 2;
  const { toast } = useToast();
  const isShopOwner = userRole === 1 || userRole === 3;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    setCurrentPage(1); // Reset to first page
  };

  useEffect(() => {
    const fetchBookings = async () => {
      setBookingsLoading(true);
      try {
        const filterParams: BookingFilterDto = {
          CustomerId: profileId,
        };

        if (shopId) {
          filterParams.ShopId = shopId;
        }
        if (nailArtistId) {
          filterParams.NailArtistId = nailArtistId;
        }
        if ((userRole === 1 || userRole === 3) && !shopId && userShopId) {
          filterParams.ShopId = userShopId;
        }
        if (userRole === 4 && !nailArtistId && userNailArtistId) {
          filterParams.NailArtistId = userNailArtistId;
        }

        const data = await BookingAPI.filter(filterParams);
        setBookings(data);
      } catch (error) {
        console.error("Failed to load bookings:", error);
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchBookings();
  }, [profileId, shopId, nailArtistId, userRole, userShopId, userNailArtistId]);

  const refreshBookings = async () => {
    const filterParams: BookingFilterDto = {
      CustomerId: profileId,
      ...(shopId && { ShopId: shopId }),
      ...(nailArtistId && { NailArtistId: nailArtistId }),
    };
    const updated = await BookingAPI.filter(filterParams);
    setBookings(updated);
  };

  // Handlers
  const handleCancelBooking = async (bookingId: string) => {
    setUpdatingId(bookingId);
    try {
      await BookingAPI.cancelBooking(bookingId);
      await refreshBookings();
    } catch (error) {
      console.error("Failed to cancel booking:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleApproveBooking = async (bookingId: string) => {
    setUpdatingId(bookingId);
    try {
      const response = await BookingAPI.updateStatus(bookingId, 1);
      toast({
        description: response.message,
        variant: "success",
        duration: 3000,
      });
      await refreshBookings();
    } catch (error) {
      console.error("Failed to approve booking:", error);
      toast({
        description: error?.message,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    setUpdatingId(bookingId);
    try {
      const response = await BookingAPI.updateStatus(bookingId, 2);
      toast({
        description: response.message,
        variant: "success",
        duration: 3000,
      });
      await refreshBookings();
    } catch (error) {
      console.error("Failed to reject booking:", error);
      toast({
        description: error?.message,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCompleteBooking = async (bookingId: string) => {
    setUpdatingId(bookingId);
    try {
      const response = await BookingAPI.updateStatus(bookingId, 3);
      toast({
        description: response.message,
        variant: "success",
        duration: 3000,
      });
      await refreshBookings();
    } catch (error) {
      console.error("Failed to complete booking:", error);
      toast({
        description: error?.message,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBookings = bookings.slice(startIndex, endIndex);
  const totalPages = Math.ceil(bookings.length / itemsPerPage);

  if (bookingsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-[2rem] p-10 text-center border-2 border-dashed border-slate-100">
        <p className="text-slate-400 font-bold text-sm">
          Người dùng này không có lịch hẹn với cửa hàng của bạn
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <span className="w-2 h-6 bg-[#950101] rounded-full" />
        <h2 className="font-black text-lg text-slate-800 uppercase tracking-tight flex items-center gap-2">
          {shopId
            ? "Lịch sử đặt lịch với cửa hàng"
            : "Lịch sử đặt lịch với bạn"}
        </h2>
        <span className="text-[10px] font-black bg-[#950101] text-white px-2 py-1 rounded-lg">
          {bookings.length} lượt đặt
        </span>
      </div>

      <Tabs
        defaultValue="all"
        value={currentTab} // Add value prop
        onValueChange={handleTabChange} // Add onValueChange handler
        className="w-full"
      >
        <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
          <TabsList className="flex bg-transparent w-max gap-2 h-auto p-0">
            <TabTrigger value="all" label="Tất cả" />
            <TabTrigger value="pending" label="Đang chờ xác nhận" />
            <TabTrigger value="approved" label="Đã xác nhận" />
            <TabTrigger value="rejected" label="Đã từ chối" />
            <TabTrigger value="completed" label="Đã hoàn thành" />
            <TabTrigger value="cancelled" label="Đã hũy" />
          </TabsList>
        </div>
        <div className="mt-4">
          {[
            "all",
            "pending",
            "approved",
            "rejected",
            "completed",
            "cancelled",
          ].map((tab) => (
            <TabsContent
              key={tab}
              value={tab}
              className="space-y-4 outline-none"
            >
              {bookings
                .filter((b) => {
                  if (tab === "all") return true;
                  const statusMap: any = {
                    pending: 0,
                    approved: 1,
                    rejected: 2,
                    completed: 3,
                    cancelled: 4,
                  };
                  return b.status === statusMap[tab];
                })
                .slice(startIndex, endIndex)
                .map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    isShopOwner={isShopOwner}
                    onCancel={userRole === 0 ? handleCancelBooking : undefined}
                    onApprove={isShopOwner ? handleApproveBooking : undefined}
                    onReject={isShopOwner ? handleRejectBooking : undefined}
                    onComplete={isShopOwner ? handleCompleteBooking : undefined}
                    isLoading={updatingId === booking.id}
                  />
                ))}
            </TabsContent>
          ))}
        </div>
      </Tabs>

      {bookings.length > itemsPerPage && (
        <div className="mt-8 bg-white rounded-2xl p-2 shadow-sm border border-slate-100">
          <MobilePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            showInfo={true}
            visibleItems={paginatedBookings.length}
            totalItems={bookings.length}
          />
        </div>
      )}
    </div>
  );
}

// TabTrigger Component
function TabTrigger({ value, label }: { value: string; label: string }) {
  return (
    <TabsTrigger
      value={value}
      className="data-[state=active]:bg-[#950101] data-[state=active]:text-white bg-white text-slate-400 px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-sm transition-all border border-slate-50"
    >
      {label}
    </TabsTrigger>
  );
}
