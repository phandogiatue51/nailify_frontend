// components/profile/ProfileInfoPage.tsx
"use client";

import { profileAPI } from "@/services/api";
import { Profile } from "@/types/database";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RoleBadge } from "../badge/RoleBadge";

export default function ProfileInfoPage() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={profile.avatarUrl ?? "/default-avatar.png"}
          alt={profile.fullName}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h1 className="text-xl font-semibold">{profile.fullName}</h1>
          <p className="text-sm text-gray-500">
            <RoleBadge role={profile.role} />
          </p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Phone:</strong> {profile.phone ?? "N/A"}
        </p>
        <p>
          <strong>Address:</strong> {profile.address ?? "N/A"}
        </p>
      </div>
    </div>
  );
}
