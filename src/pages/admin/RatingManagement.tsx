import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const RatingManagement = () => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user?.role !== 2) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý đánh giá</h1>
          <p className="text-muted-foreground">Theo dõi các đánh giá đến từ những trải nghiệm của khách hàng</p>
        </div>
        <div className="text-sm text-muted-foreground">Nailify Dashboard</div>
      </div>
    </div>
  );
};

export default RatingManagement;
