"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { useToast } from "./use-toast";
interface DecodedJWT {
  userId: string;
  email: string;
  role: 0 | 1 | 2 | 3 | 4;
  fullName?: string;
  shopId?: string | null;
  nailArtistId?: string | null;
  shopLocationId?: string | null;
  exp: number;
}

const decodeJWT = (token: string): DecodedJWT | null => {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));

    const roleClaim =
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    let role: 0 | 1 | 2 | 3 | 4;

    switch (roleClaim) {
      case "0":
      case "Customer":
        role = 0;
        break;
      case "1":
      case "ShopOwner":
        role = 1;
        break;
      case "2":
      case "Admin":
        role = 2;
        break;
      case "3":
      case "Manager":
        role = 3;
        break;
      case "4":
      case "NailArtist":
        role = 4;
        break;
      default:
        console.warn("Unknown role claim:", roleClaim);
        role = 0;
    }

    return {
      userId:
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ],
      email:
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ],
      role,
      fullName:
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      shopId: decoded["ShopId"] ?? null,
      nailArtistId: decoded["NailArtistId"] ?? null,
      shopLocationId: decoded["ShopLocationId"] ?? null,
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
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<DecodedJWT | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const token =
      sessionStorage.getItem("jwtToken");
    if (token && !isTokenExpired(token)) {
      const decoded = decodeJWT(token);
      if (decoded) {
        setUser(decoded);
      }
    }
    Promise.resolve().then(() => setLoading(false));
  }, []);

  const login = async (
    email: string,
    password: string,
  ) => {
    if (!isMounted.current) return;

    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });

      if (!response.token) throw new Error("No token received");

      const storage = sessionStorage;
      storage.setItem("jwtToken", response.token);

      const decoded = decodeJWT(response.token);
      if (!decoded) throw new Error("Failed to decode token");

      if (isMounted.current) {
        setUser(decoded);
        toast({
          description: response.message,
          variant: "success",
          duration: 3000,
        });
        setTimeout(() => {
          if (decoded.role === 1) {
            navigate("/shop-dashboard");
          } else if (decoded.role === 2) {
            navigate("/admin");
          } else if (decoded.role === 4) {
            navigate("/artist-dashboard");
          }
          if (decoded.role === 3) {
            navigate("/staff-dashboard");
          }

          navigate("/");
        }, 100);
      }

      return response;
    } catch (error: any) {
      if (isMounted.current) {
        toast({
          description: error?.message || "Có lỗi xảy ra!",
          variant: "destructive",
          duration: 5000,
        });
      }
      throw error;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const signup = async (userData: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    address?: string;
    role: 0 | 1 | 4;
  }) => {
    if (!isMounted.current) return;

    setLoading(true);
    try {
      const response = await authAPI.signUp(userData);

      if (isMounted.current) {
        toast({
          description: response.message || "Account created!",
          duration: 3000,
        });
      }
      return response;
    } catch (error: any) {
      if (isMounted.current) {
        toast({
          description: error.message || "Signup failed",
          variant: "destructive",
        });
      }
      throw error;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const logout = useCallback(
    (redirect: boolean = true) => {
      if (!isMounted.current) return;

      sessionStorage.removeItem("jwtToken");
      setUser(null);

      toast({ description: "Đăng xuất thành công", duration: 3000 });

      if (redirect) {
        setTimeout(() => {
          if (isMounted.current) {
            navigate("/auth");
          }
        }, 100);
      }
    },
    [navigate, toast],
  );

  const getAuthHeader = useCallback(() => {
    const token =
      sessionStorage.getItem("jwtToken");

    if (!token) {
      return {};
    }

    const decoded = decodeJWT(token);
    if (!decoded || isTokenExpired(token)) {
      return {};
    }

    return { Authorization: `Bearer ${token}` };
  }, []);

  const isAuthenticated = useCallback(() => {
    const token =
      sessionStorage.getItem("jwtToken");
    return !!(token && !isTokenExpired(token));
  }, []);

  const hasRole = useCallback(
    (role: number | number[]) => {
      if (user?.role === undefined) return false;
      if (Array.isArray(role)) return role.includes(user.role);
      return user.role === role;
    },
    [user],
  );

  return {
    user,
    login,
    signup,
    logout,
    isAuthenticated,
    getAuthHeader,
    hasRole,
    loading,
  };
}
