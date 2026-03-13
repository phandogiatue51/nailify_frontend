import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { useShopOwnerLocations } from "@/hooks/useLocation";
import LocationForm from "@/components/shop/LocationForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft } from "lucide-react";

const CreateLocationPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuthContext();
  const { createLocation } = useShopOwnerLocations();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user?.role !== 1) {
    return <Navigate to="/auth" replace />;
  }

  const handleSubmit = async (data: any) => {
    try {
      await createLocation.mutateAsync(data);
      navigate("/my-shop?tab=locations");
    } catch (error) {
      console.error("Failed to create location:", error);
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
            <h1
              className="font-black tracking-tight uppercase text-xl bg-clip-text text-transparent pb-1"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
                WebkitBackgroundClip: "text",
              }}
            >
              Thêm chi nhánh
            </h1>
          </div>
        </div>

        <LocationForm
          onSubmit={handleSubmit}
          isLoading={createLocation.isPending}
          onCancel={() => navigate("/my-shop?tab=locations")}
        />
      </div>
    </div>
  );
};

export default CreateLocationPage;
