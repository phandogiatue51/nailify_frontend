"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { useToast } from "./use-toast";

interface DecodedJWT {
  userId: string;
  email: string;
  role: 0 | 1 | 2; // 0: Customer, 1: ShopOwner, 2: Admin
  fullName?: string;
  exp: number;
}

const decodeJWT = (token: string): DecodedJWT | null => {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));

    const roleClaim =
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    let role: 0 | 1 | 2;

    if (roleClaim === "Customer" || roleClaim === "0" || roleClaim === 0) {
      role = 0;
    } else if (roleClaim === "ShopOwner" || roleClaim === "1" || roleClaim === 1) {
      role = 1;
    } else if (roleClaim === "Admin" || roleClaim === "2" || roleClaim === 2) {
      role = 2;
    } else {
      console.warn("Unknown role claim:", roleClaim);
      role = 0;
    }

    return {
      userId:
        decoded[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/nameidentifier"
        ],
      email:
        decoded[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/emailaddress"
        ],
      role: role,
      fullName:
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/name"],
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Initialize user from token on mount
  useEffect(() => {
    const token =
      localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");
    if (token && !isTokenExpired(token)) {
      const decoded = decodeJWT(token);
      if (decoded && isMounted.current) {
        setUser(decoded);
      }
    }
  }, []);

  const login = async (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => {
    if (!isMounted.current) return;

    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });

      if (!response.token) throw new Error("No token received");

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("jwtToken", response.token);

      const decoded = decodeJWT(response.token);
      if (!decoded) throw new Error("Failed to decode token");

      if (isMounted.current) {
        setUser(decoded);
        toast({ description: "Login successful!", duration: 3000 });

        setTimeout(() => {
          // Check role as number now
          if (decoded.role === 1) { // ShopOwner = 1
            navigate("/dashboard");
          } else {
            navigate("/");
          }
        }, 100);
      }

      return response;
    } catch (error: any) {
      if (isMounted.current) {
        toast({
          description: error.message || "Login failed",
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

  const signup = async (userData: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role: 0 | 1; // Updated to numbers
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

      localStorage.removeItem("jwtToken");
      sessionStorage.removeItem("jwtToken");
      setUser(null);

      toast({ description: "Logged out successfully", duration: 3000 });

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
      localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");

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
      localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");
    return !!(token && !isTokenExpired(token));
  }, []);

  const hasRole = useCallback(
    (role: number | number[]) => { // Updated to accept numbers
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