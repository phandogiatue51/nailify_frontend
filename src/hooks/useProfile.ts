import { useState, useCallback, useEffect } from "react";
import { profileAPI } from "@/services/api";
import { Profile } from "@/types/database";
import { useToast } from "./use-toast";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProfile = useCallback(async (forceRefresh = false) => {
    // Don't fetch if already loading
    if (loading && !forceRefresh) return profile;

    setLoading(true);
    setError(null);
    try {
      const data = await profileAPI.getProfile();
      setProfile(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Failed to fetch profile");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load profile on mount
  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const data = await profileAPI.getProfile();
        if (mounted) {
          setProfile(data);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || "Failed to load profile");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const updateProfile = useCallback(async (profileData: Partial<Profile>) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Update the profile
      const response = await profileAPI.updateProfile(profileData);

      // Show success toast
      toast({
        description: response.message || "Profile updated successfully",
        variant: "success",
        duration: 3000,
      });

      // 2. IMPORTANT: Fetch the updated profile from the server
      const updatedProfile = await profileAPI.getProfile();
      setProfile(updatedProfile);

      return updatedProfile;
    } catch (error: any) {
      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(
    async (passwordData: { currentPassword: string; newPassword: string }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await profileAPI.changePassword(passwordData);
        toast({
          description: response.message || "Password changed successfully",
          variant: "success",
          duration: 3000,
        });
        return response;
      } catch (error: any) {
        toast({
          description: error?.message || "Có lỗi xảy ra!",
          variant: "destructive",
          duration: 5000,
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const clearProfile = useCallback(() => {
    setProfile(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    changePassword,
    clearProfile,
  };
}