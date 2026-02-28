"use client";

import { profileAPI, artistAPI } from "@/services/api";
import { Profile } from "@/types/database";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { RoleBadge } from "../badge/RoleBadge";
import { ChevronLeft, Calendar, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "../ui/button";
import ProfileBookingsTabs from "./ProfileBookingsTabs";

export default function CustomerInfo() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [shopId, setShopId] = useState<string | null>(null);
  const [nailArtistId, setNailArtistId] = useState<string | null>(null);
  const [navigating, setNavigating] = useState(false); // Add navigation loading state

  const navigate = useNavigate();

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

  const handleBookNow = () => {
    const bookingState: any = {
      type: user.shopId ? "shop" : "artist",
      customerProfileId: profile?.id,
      customerName: profile?.fullName,
      customerPhone: profile?.phone,
      customerAddress: profile?.address,
    };

    if (user.shopId) {
      bookingState.shopId = user.shopId;
    } else if (user.nailArtistId) {
      bookingState.nailArtistId = user.nailArtistId;
    }

    navigate(`/booking/collection-selection`, { state: bookingState });
  };

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

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[#FFCFE9]/30 rounded-full transition-colors"
            disabled={navigating} // Disable while navigating
          >
            <ChevronLeft className="w-6 h-6 text-[#950101]" />
          </button>
          <h1 className="font-black uppercase tracking-tight text-slate-800">
            Profile Details
          </h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Profile Card */}
        <ProfileCard
          profile={profile}
          isCustomer={isCustomer}
          onBookNow={handleBookNow}
          onViewFullProfile={async () => {
            setNavigating(true); // Set loading before navigation
            try {
              if (profile?.role === 4) {
                const artist = await artistAPI.getByProfileId(profile.id);
                if (artist?.id) {
                  navigate(`/artist/${artist.id}`);
                }
              }
            } catch (error) {
              console.error("Navigation failed:", error);
              setNavigating(false); // Reset on error
            }
          }}
          isNavigating={navigating} // Pass loading state to button
        />

        {/* Bookings Section */}
        {profile.role === 0 && (
          <ProfileBookingsTabs
            profileId={profile.id}
            shopId={shopId}
            nailArtistId={nailArtistId}
            userRole={user?.role}
            userShopId={user?.shopId}
            userNailArtistId={user?.nailArtistId}
          />
        )}
      </div>

      {navigating && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-[#FFCFE9] border-t-[#950101] rounded-full animate-spin" />
            <p className="text-sm font-bold text-slate-700">
              Loading artist profile...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Profile Card Component
function ProfileCard({
  profile,
  isCustomer,
  onBookNow,
  onViewFullProfile,
  isNavigating, // Add this prop
}: any) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-[#950101]/5 border border-slate-50 mb-6 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FFCFE9]/40 blur-3xl rounded-full" />

      <div className="flex flex-col items-center text-center">
        <div className="relative">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="w-12 h-12 rounded-full object-cover border"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#950101] to-[#FFCFE9] flex items-center justify-center">
              <span className="text-xl font-bold text-white uppercase">
                {profile.fullName?.[0] || "U"}
              </span>
            </div>
          )}

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
        {!isCustomer && (
          <Button
            onClick={onBookNow}
            className="font-black tracking-tight text-md w-50 rounded-[2rem] mt-4"
            style={{
              background:
                "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
              border: "none",
            }}
          >
            Book for this Customer
          </Button>
        )}
      </div>

      <div className="mt-4 border-t border-slate-50 grid grid-cols-1 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FFCFE9]/50 flex items-center justify-center">
            <Store className="w-4 h-4 text-[#950101]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Phone
            </p>
            <p className="text-sm font-bold text-slate-700">
              {profile.phone ?? "Not provided"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FFCFE9]/50 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-[#950101]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Address
            </p>
            <p className="text-sm font-bold text-slate-700 truncate">
              {profile.address ?? "No address on file"}
            </p>
          </div>
        </div>
      </div>

      {isCustomer && (
        <div className="mt-8">
          <Button
            onClick={onViewFullProfile}
            disabled={isNavigating} // Disable button while navigating
            className="w-full h-14 rounded-2xl bg-[#950101] hover:bg-[#7a0101] text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-[#950101]/20 transition-all active:scale-[0.98]"
          >
            {isNavigating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Loading...
              </div>
            ) : (
              "View Full Profile"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
