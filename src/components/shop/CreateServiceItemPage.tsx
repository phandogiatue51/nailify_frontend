import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { useShopOwnerServiceItems } from "@/hooks/useServiceItems";
import ServiceItemForm from "@/components/shop/ServiceItemForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Loader2 } from "lucide-react";
import { ComponentType } from "@/types/database";

const CreateServiceItemPage = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuthContext();
  const { createServiceItem } = useShopOwnerServiceItems();

  // Validate and parse component type
  const parsedType = parseInt(type || "0");
  const componentType: ComponentType =
    parsedType >= 0 && parsedType <= 4 ? (parsedType as ComponentType) : 0; // Default to 0 if invalid

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user?.role !== 1) {
    return <Navigate to="/auth" replace />;
  }

  const handleSubmit = async (formData: FormData) => {
    await createServiceItem.mutateAsync(formData);
    navigate(-1);
  };

  const componentLabels = ["Form", "Base", "Shape", "Polish", "Design"];

  return (
    <MobileLayout>
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
            <h1 className="text-2xl font-bold">
              Add {componentLabels[componentType]}
            </h1>
            <p className="text-muted-foreground">Create a new service item</p>
          </div>
        </div>

        <ServiceItemForm
          componentType={componentType}
          onSubmit={handleSubmit}
          isLoading={createServiceItem.isPending}
        />

        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="w-full"
        >
          Cancel
        </Button>
      </div>
    </MobileLayout>
  );
};

export default CreateServiceItemPage;
