"use client";

import { profileAPI, BookingAPI, shopAPI, artistAPI } from "@/services/api";
import { Profile, Booking } from "@/types/database";
import { BookingFilterDto } from "@/types/filter";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom"; // Add useLocation
import { RoleBadge } from "../badge/RoleBadge";
import { ChevronLeft, Calendar, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BookingCard from "../booking/BookingCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { MobilePagination } from "../ui/pagination-mobile";
import { Button } from "../ui/button";

export default function ProfileInfoPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation(); // Add this to get navigation state
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [shopId, setShopId] = useState<string | null>(null);
  const [nailArtistId, setNailArtistId] = useState<string | null>(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const [paginatedBookings, setPaginatedBookings] = useState<Booking[]>([]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const isCustomer = user?.role === 0;
  useEffect(() => {
    if (location.state) {
      if (location.state.shopId) {
        setShopId(location.state.shopId);
      }
      if (location.state.nailArtistId) {
        setNailArtistId(location.state.nailArtistId);
      }
    }
  }, [location.state]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileAPI.getById(id!);
        setProfile(data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  // Fetch bookings based on role and available IDs
  useEffect(() => {
    const fetchBookings = async () => {
      if (!profile?.id) return;

      setBookingsLoading(true);
      try {
        const filterParams: BookingFilterDto = {
          CustomerId: profile.id, // Always filter by customer ID
        };

        // If we have shopId from navigation state, add it to filter
        if (shopId) {
          filterParams.ShopId = shopId;
        }

        // If we have nailArtistId from navigation state, add it to filter
        if (nailArtistId) {
          filterParams.NailArtistId = nailArtistId;
        }

        // If viewer is shop owner/manager and no shopId in state, use their own shopId
        if ((user?.role === 1 || user?.role === 3) && !shopId && user?.shopId) {
          filterParams.ShopId = user.shopId;
        }

        // If viewer is nail artist and no nailArtistId in state, use their own nailArtistId
        if (user?.role === 4 && !nailArtistId && user?.nailArtistId) {
          filterParams.NailArtistId = user.nailArtistId;
        }

        console.log("Filter params:", filterParams); // Debug log
        const data = await BookingAPI.filter(filterParams);
        setBookings(data);
      } catch (error) {
        console.error("Failed to load bookings:", error);
      } finally {
        setBookingsLoading(false);
      }
    };

    if (profile?.id) {
      fetchBookings();
    }
  }, [profile?.id, shopId, nailArtistId, user?.role, user?.shopId, user?.nailArtistId]);

  // Update paginated bookings when bookings or currentPage changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedBookings(bookings.slice(startIndex, endIndex));
  }, [bookings, currentPage]);

  const filterBookingsByStatus = (status: number) => {
    return bookings.filter(booking => booking.status === status);
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await BookingAPI.cancelBooking(bookingId);
      // Refresh bookings after cancellation
      if (profile?.id) {
        const filterParams: BookingFilterDto = {
          CustomerId: profile.id,
          ...(shopId && { ShopId: shopId }),
          ...(nailArtistId && { NailArtistId: nailArtistId })
        };
        const updatedBookings = await BookingAPI.filter(filterParams);
        setBookings(updatedBookings);
      }
    } catch (error) {
      console.error("Failed to cancel booking:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Profile not found</p>
      </div>
    );
  }
  const totalPages = Math.ceil(bookings.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[#FFCFE9]/30 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-[#950101]" />
          </button>
          <h1 className="font-black uppercase tracking-tight text-slate-800">
            Profile Details
          </h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 pb-20">
        {/* Profile Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-[#950101]/5 border border-slate-50 mb-6 relative overflow-hidden">
          {/* Decorative Pink Glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FFCFE9]/40 blur-3xl rounded-full" />

          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <img
                src={profile.avatarUrl ?? "/default-avatar.png"}
                alt={profile.fullName}
                className="w-24 h-24 rounded-full object-cover border-4 border-[#FFCFE9] shadow-md"
              />
              <div className="absolute bottom-0 right-0">
                <RoleBadge role={profile.role} />
              </div>
            </div>

            <h1 className="text-2xl font-black text-slate-800 mt-4 uppercase tracking-tighter">
              {profile.fullName}
            </h1>
            <p className="text-[#950101] font-bold text-xs uppercase tracking-widest mt-1 opacity-70">
              {profile.email}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-50 grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#FFCFE9]/50 flex items-center justify-center">
                <Store className="w-4 h-4 text-[#950101]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone</p>
                <p className="text-sm font-bold text-slate-700">{profile.phone ?? "Not provided"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#FFCFE9]/50 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-[#950101]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Address</p>
                <p className="text-sm font-bold text-slate-700 truncate">{profile.address ?? "No address on file"}</p>
              </div>
            </div>
          </div>
          {isCustomer && (
            <div className="mt-8">
              <Button
                onClick={async () => {
                  try {
                    if (profile?.role === 4) {
                      const artist = await artistAPI.getByProfileId(profile.id);
                      if (artist?.id) {
                        navigate(`/artist/${artist.id}`);
                      }
                    }
                  } catch (error) {
                    console.error("Navigation failed:", error);
                  }
                }}
                className="w-full h-14 rounded-2xl bg-[#950101] hover:bg-[#7a0101] text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-[#950101]/20 transition-all active:scale-[0.98]"
              >
                View Full Profile
              </Button>
            </div>
          )}
        </div>

        {profile.role === 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="font-black text-lg text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <span className="w-2 h-6 bg-[#950101] rounded-full" />
                {shopId ? "Shop History" : "Visits"}
              </h2>
              <span className="text-[10px] font-black bg-[#950101] text-white px-2 py-1 rounded-lg">
                {bookings.length} TOTAL
              </span>
            </div>

            {bookingsLoading ? (
              <div className="flex flex-col items-center py-12 space-y-3">
                <div className="w-10 h-10 border-4 border-[#FFCFE9] border-t-[#950101] rounded-full animate-spin" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Records...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-10 text-center border-2 border-dashed border-slate-100">
                <p className="text-slate-400 font-bold text-sm">No bookings found yet.</p>
              </div>
            ) : (
              <Tabs defaultValue="all" className="w-full">
                {/* Scrollable Tabs for Mobile */}
                <div className="overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
                  <TabsList className="flex bg-transparent w-max gap-2 h-auto p-0">
                    <TabTrigger value="all" label="All" />
                    <TabTrigger value="pending" label="Pending" />
                    <TabTrigger value="approved" label="Approved" />
                    <TabTrigger value="completed" label="Done" />
                    <TabTrigger value="canceled" label="Canceled" />
                  </TabsList>
                </div>

                <div className="mt-4">
                  <TabsContent value="all" className="space-y-4 outline-none">
                    {paginatedBookings.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        isShopOwner={user?.role === 1 || user?.role === 3}
                        onCancel={user?.role === 0 ? handleCancelBooking : undefined}
                      />
                    ))}
                  </TabsContent>
                  {/* ... repeat TabsContent for other values using the same pattern ... */}
                </div>

                {!bookingsLoading && bookings.length > itemsPerPage && (
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
              </Tabs>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper component for cleaner code
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