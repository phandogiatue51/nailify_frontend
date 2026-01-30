import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";

export function useRequireRole(allowedRoles: number[]) {
  const { user, loading } = useAuthContext();

  if (loading) return { loading: true, redirect: null };

  if (!user) {
    return { loading: false, redirect: <Navigate to="/auth" replace /> };
  }

  if (!allowedRoles.includes(user.role)) {
    return { loading: false, redirect: <Navigate to="/" replace /> };
  }

  return { loading: false, redirect: null, user };
}
