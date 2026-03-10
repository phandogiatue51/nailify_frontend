import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import RatingList from "@/components/admin/ratings/RatingList";
import RatingFilter from "@/components/admin/ratings/RatingFilter";

const RatingManagement = () => {
  const { user, loading } = useAuthContext();
  const [selectedRating, setSelectedRating] = useState<number | undefined>(undefined);
  const [showRatedOnly, setShowRatedOnly] = useState(true);

  const handleReset = () => {
    setSelectedRating(undefined);
    setShowRatedOnly(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#950101]" />
      </div>
    );
  }

  if (!user || user?.role !== 2) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
            Quản lý <span className="text-[#950101]">Đánh giá</span>
          </h1>
          <p className="text-sm font-bold text-slate-400 italic mt-1">
            Theo dõi các đánh giá đến từ những trải nghiệm của khách hàng
          </p>
        </div>
      </div>

      {/* Rating Filter Component */}
      <div className="mb-6">
        <RatingFilter
          selectedRating={selectedRating}
          showRatedOnly={showRatedOnly}
          onRatingChange={setSelectedRating}
          onShowRatedOnlyChange={setShowRatedOnly}
          onReset={handleReset}
        />
      </div>

      {/* Rating List Component */}
      <RatingList
        title="Tất cả đánh giá"
        selectedRating={selectedRating}
        showRatedOnly={showRatedOnly}
      />
    </div>
  );
};

export default RatingManagement;