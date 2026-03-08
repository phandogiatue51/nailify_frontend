"use client";

import { useAuthContext } from "@/components/auth/AuthProvider";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DetailRow } from "@/components/ui/detail-row";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/ui/header";
import InstallButton from "@/components/install-button";
import {
  LogOut,
  Loader2,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  KeyRound,
} from "lucide-react";
import { VerificationBadge } from "@/components/badge/VerificationBadge";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { RoleBadge } from "@/components/badge/RoleBadge";
import { VerificationButton } from "@/components/email/VerificationButton";

const ProfilePage = () => {
  const { logout } = useAuthContext();
  const { profile, loading, error } = useProfile();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    logout();
    navigate("/auth");
  };

  if (loading && !profile) {
    return (
      <div>
        <div className="flex flex-col justify-center items-center h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground mt-4 font-medium">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div>
        <div className="p-6 mt-10 text-center">
          <div className="bg-destructive/10 p-4 rounded-xl text-destructive mb-6">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error || "Profile not found"}</p>
          </div>
          <Button className="w-full" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Nailify"/>

      <div className="pb-20 p-6">
        <div className=" px-6 pt-10 pb-6 text-center">
          <div className="relative mx-auto w-24 h-24 mb-4">
            <div className="w-full h-full rounded-full overflow-hidden ring-4 ring-white shadow-md border border-slate-300 flex items-center justify-center">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-5xl font-bold text-white uppercase bg-gradient-to-br from-[#950101] to-[#FFCFE9] w-full h-full flex items-center justify-center rounded-full">
                  {profile.fullName?.[0] || "U"}
                </span>
              )}
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center justify-center gap-2">
            {profile.fullName || "User"}
          </h1>
          <div className="flex justify-center mt-2">
            <RoleBadge role={profile.role} />
          </div>

          {profile.role === 1 && (
            <VerificationBadge label="Shop" verified={profile.shopVerified} />
          )}

          {profile.role === 4 && (
            <VerificationBadge
              label="Artist"
              verified={profile.artistVerified}
            />
          )}
        </div>

        <div className="p-4 space-y-6">
          <section>
            <div className="flex justify-between items-end mb-3 px-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Account Details
              </h3>
              <button
                onClick={() => navigate("/profile/edit")}
                className="text-sm font-medium text-primary underline"
              >
                Edit Profile
              </button>
            </div>
            <Card className="overflow-hidden border-none shadow-sm ring-1 ring-slate-200">
              <CardContent className="p-0 divide-y divide-slate-100">
                <DetailRow icon={Mail} label="Email" value={profile.email}>
                  {profile.isVerified ? (
                    <Badge
                      variant="default"
                      className="bg-green-400 text-white text-xs flex items-center gap-1"
                    >
                      Verified
                    </Badge>
                  ) : (
                    <VerificationButton
                      email={profile.email}
                      size="sm"
                      variant="outline"
                      className="w-auto px-4 h-6 text-xs border-amber-200 text-amber-700 rounded-full"
                    />
                  )}
                </DetailRow>
                <DetailRow
                  icon={Phone}
                  label="Phone"
                  value={profile.phone || "Not set"}
                />
                <DetailRow
                  icon={MapPin}
                  label="Address"
                  value={profile.address || "Not set"}
                />
              </CardContent>
            </Card>
          </section>
          <InstallButton />
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 px-1">
              Security
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-between h-12 px-4 border-slate-200"
                onClick={() => navigate("/profile/change-password")}
              >
                <div className="flex items-center gap-3">
                  <KeyRound className="w-4 h-4 text-slate-500" />
                  <span>Change Password</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start h-12 px-4 text-white bg-red-400"
                onClick={handleSignOut}
                disabled={loading}
              >
                <LogOut className="w-4 h-4 mr-3" />
                <span className="font-semibold">Sign Out</span>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
