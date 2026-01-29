import { useAuthContext } from "@/components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const ServicesManagement = () => {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();

  if (!user || user?.role !== 2) {
    return <Navigate to="/auth" replace />;
  }
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Services Management</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p>Welcome to the Services Management!</p>
      </div>
    </div>
  );
};

export default ServicesManagement;
