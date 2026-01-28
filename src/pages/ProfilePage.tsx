"use client";

import { useAuthContext } from "@/components/auth/AuthProvider";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LogOut,
  Mail,
  Phone,
  Loader2,
  CircleCheckBig,
  CircleAlert,
} from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { RoleBadge } from "@/components/badge/RoleBadge";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { VerificationButton } from "@/components/email/VerificationButton";

const ProfilePage = () => {
  const { logout } = useAuthContext();
  const { profile, updateProfile, loading, error } = useProfile();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        phone: profile.phone || "",
        email: profile.email || "",
      });
    }
  }, [profile]);

  const handleSignOut = async () => {
    await logout();
    navigate("/auth");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const updatedProfile = await updateProfile(formData);

      if (updatedProfile) {
        setFormData({
          fullName: updatedProfile.fullName || "",
          phone: updatedProfile.phone || "",
          email: updatedProfile.email || "",
        });
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        phone: profile.phone || "",
        email: profile.email || "",
      });
    }
    setIsEditing(false);
  };

  // Show loading state
  if (loading && !profile) {
    return (
      <MobileLayout>
        <div className="p-4 flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-500" />
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  // Show error state
  if (error && !profile) {
    return (
      <MobileLayout>
        <div className="p-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="font-medium">Error loading profile</p>
            <p className="text-sm mt-1">{error}</p>
            <Button
              variant="outline"
              className="mt-3"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  // Handle case when profile is undefined
  if (!profile) {
    return (
      <MobileLayout>
        <div className="p-4">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
            <p className="font-medium">Profile not found</p>
            <p className="text-sm mt-1">Please try refreshing the page</p>
            <Button
              variant="outline"
              className="mt-3"
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold pt-4">Profile</h1>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold">
                  {profile.fullName || "User"}
                </h2>
                <p className="text-md text-muted-foreground">
                  <RoleBadge role={profile.role} />
                </p>
                {profile.isVerified === true ? (
                  <div className="mt-4">
                    <div className="flex items-center gap-2">
                      <CircleCheckBig className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700 font-medium">
                        Email verified
                      </span>
                    </div>
                  </div>
                ) : profile.isVerified === false ? (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CircleAlert className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-yellow-700 font-medium">
                        Email not verified
                      </span>
                    </div>
                    {profile.email && (
                      <VerificationButton
                        email={profile.email}
                        size="sm"
                        variant="outline"
                        className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                      />
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-base">Account Details</CardTitle>
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                disabled={isUpdating}
              >
                Edit
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={isUpdating}
              >
                Cancel
              </Button>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {!isEditing ? (
              <>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <span>{profile.email || "No email"}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <span>{profile.phone}</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  disabled={isUpdating}
                />
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  disabled={isUpdating}
                />
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  disabled={isUpdating}
                />
                <Button
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="w-full"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/profile/change-password")}
              className="mt-2"
              disabled={isUpdating}
            >
              Change Password
            </Button>
          </CardContent>
        </Card>

        <Button
          variant="destructive"
          className="w-full"
          onClick={handleSignOut}
          disabled={loading || isUpdating}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;
