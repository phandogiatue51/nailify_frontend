import { useState, useCallback, useEffect } from "react";
import { profileAPI } from "@/services/api";
import { Profile } from "@/types/database";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(
    async (forceRefresh = false) => {
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
    },
    [loading, profile],
  );

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
      const data = await profileAPI.updateProfile(profileData);
      setProfile(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(
    async (passwordData: { currentPassword: string; newPassword: string }) => {
      setLoading(true);
      setError(null);
      try {
        const data = await profileAPI.changePassword(passwordData);
        return data;
      } catch (err: any) {
        setError(err.message || "Failed to change password");
        throw err;
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
