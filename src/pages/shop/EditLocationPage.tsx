import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import {
  useShopOwnerLocations,
  useShopOwnerLocationById,
} from "@/hooks/useLocation";
import LocationForm from "@/components/shop/LocationForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, Loader2 } from "lucide-react";

const EditLocationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuthContext();
  const { data: location, isLoading } = useShopOwnerLocationById(id);
  const { updateLocation } = useShopOwnerLocations();

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user?.role !== 1) {
    return <Navigate to="/auth" replace />;
  }

  if (!location) {
    return <Navigate to="/my-shop?tab=locations" replace />;
  }

  const handleSubmit = async (data: any) => {
    try {
      if (!id) {
        console.error("Missing location id in URL");
        return;
      }
      await updateLocation.mutateAsync({
        id,
        dto: data,
      });
      navigate("/my-shop?tab=locations");
    } catch (error) {
      console.error("Failed to update location:", error);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="p-4 space-y-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="group rounded-full mr-4 border-2 border-slate-400 hover:border-[#950101] transition-all px-3"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600 group-hover:text-[#950101] transition-transform" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Chỉnh sửa chi nhánh</h1>
          </div>
        </div>

        <LocationForm
          initialData={location}
          onSubmit={handleSubmit}
          isLoading={updateLocation.isPending}
          onCancel={() => navigate("/my-shop?tab=locations")}
        />
      </div>
    </div>
  );
};

export default EditLocationPage;
