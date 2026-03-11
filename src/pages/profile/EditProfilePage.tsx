"use client";

import { ProfileForm } from "@/components/auth/ProfileForm";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const EditProfilePage = () => {
  const { profile, updateProfile, loading } = useProfile();
  const navigate = useNavigate();

  const handleSubmit = async (formData: any, imageFile?: File | null) => {
    const profileData: any = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
    };

    await updateProfile(profileData, imageFile);
    navigate("/profile");
  };

  if (loading && !profile) {
    return (
      <div>
        <div className="flex flex-col justify-center items-center h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div>
      <div className="min-h-screen bg-slate-50/50">
        {/* Top Navigation Bar */}
        <div className="bg-white px-4 py-4 flex items-center gap-2 border-b sticky top-0 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Button>
          <div>
            <h1 className="text-xl font-black tracking-tight">
              Chỉnh sửa thông tin
            </h1>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <header className="mb-6">
              <h2 className="text-lg font-black text-slate-900">
                Thông tin cá nhân
              </h2>
              <p className="text-sm font-bold text-slate-500">
                Cập nhật các thông tin cá nhân
              </p>
            </header>

            <ProfileForm
              initialData={{
                fullName: profile.fullName || "",
                email: profile.email || "",
                phone: profile.phone || "",
                address: profile.address || "",
                avatarUrl: profile.avatarUrl,
              }}
              onSubmit={handleSubmit}
              isLoading={loading}
              isArtist={profile.role === 4}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
