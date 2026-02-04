import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { useShopOwnerLocations } from "@/hooks/useLocation";
import LocationForm from "@/components/shop/LocationForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
    <div>
      <div className="p-4 space-y-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Add Location</h1>
            <p className="text-muted-foreground">Add a new shop location</p>
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
