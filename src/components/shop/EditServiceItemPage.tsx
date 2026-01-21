import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { useShop } from "@/hooks/useShop";
import {
  useShopOwnerServiceItemById,
  useShopOwnerServiceItems,
} from "@/hooks/useServiceItems";
import ServiceItemForm from "@/components/shop/ServiceItemForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Loader2 } from "lucide-react";

const EditServiceItemPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuthContext();
  const { myShop } = useShop();

  // Hook for fetching the specific item
  const { data: item, isLoading: itemLoading } =
    useShopOwnerServiceItemById(id);

  // Hook for mutations (update)
  const { updateServiceItem } = useShopOwnerServiceItems();

  if (loading || itemLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user?.role !== 1) {
    return <Navigate to="/auth" replace />;
  }

  if (!myShop || !item) {
    return <Navigate to="/my-shop" replace />;
  }

  const handleSubmit = async (formData: FormData) => {
    await updateServiceItem.mutateAsync({
      id: item.id,
      formData,
    });
    navigate(-1); // Go back to shop page
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
              Edit {componentLabels[item.componentType]}
            </h1>
            <p className="text-muted-foreground">Update service item details</p>
          </div>
        </div>

        <ServiceItemForm
          componentType={item.componentType}
          initialData={item}
          onSubmit={handleSubmit}
          isLoading={updateServiceItem.isPending}
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

export default EditServiceItemPage;
