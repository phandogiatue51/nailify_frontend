"use client";

import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { useToast } from "./use-toast";
import { Profile } from "@/types/database";

interface DecodedJWT {
  userId: string;
  email: string;
  role: "Customer" | "ShopOwner" | "Admin";
  fullName?: string;
  exp: number;
}

const decodeJWT = (token: string): DecodedJWT | null => {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return {
      userId: decoded.sub || decoded.userId || decoded.nameid,
      email: decoded.email || decoded.Email,
      role: decoded.role || decoded.Role,
      fullName: decoded.fullName || decoded.name,
      exp: decoded.exp,
    };
  } catch (error) {
    console.error("JWT decoding error:", error);
    return null;
  }
};

const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  return Math.floor(Date.now() / 1000) >= decoded.exp;
};

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<DecodedJWT | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sync user from token on mount
  useEffect(() => {
    const token = localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");
    if (token && !isTokenExpired(token)) {
      const decoded = decodeJWT(token);
      if (decoded) {
        setUser(decoded);
        // Optionally fetch profile
        // fetchProfile(decoded.userId);
      }
    }
  }, []);

  const login = async (email: string, password: string, rememberMe?: boolean) => {
    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });

      if (!response.token) throw new Error("No token received");

      // Store token
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("jwtToken", response.token);

      // Decode and set user
      const decoded = decodeJWT(response.token);
      if (!decoded) throw new Error("Failed to decode token");

      setUser(decoded);
      if (response.profile) setProfile(response.profile);

      toast({ description: "Login successful!", duration: 3000 });

      if (decoded.role === "ShopOwner") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }

      return response;
    } catch (error: any) {
      toast({
        description: error.message || "Login failed",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role: "Customer" | "ShopOwner";
  }) => {
    setLoading(true);
    try {
      const response = await authAPI.signUp(userData);
      toast({ description: response.message || "Account created!", duration: 3000 });
      return response;
    } catch (error: any) {
      toast({
        description: error.message || "Signup failed",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("jwtToken");
    sessionStorage.removeItem("jwtToken");
    setUser(null);
    setProfile(null);
    toast({ description: "Logged out successfully", duration: 3000 });
    navigate("/login");
  }, [navigate, toast]);

  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");
    if (!token || isTokenExpired(token)) {
      logout();
      return {};
    }
    return { Authorization: `Bearer ${token}` };
  }, [logout]);

  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");
    return !!(token && !isTokenExpired(token));
  }, []);

  const hasRole = useCallback((role: string | string[]) => {
    if (!user?.role) return false;
    if (Array.isArray(role)) return role.includes(user.role);
    return user.role === role;
  }, [user]);

  return {
    user,
    profile,
    login,
    signup,
    logout,
    isAuthenticated,
    getAuthHeader,
    hasRole,
    loading,
  };
}