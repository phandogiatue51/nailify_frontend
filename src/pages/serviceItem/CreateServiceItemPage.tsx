import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import ServiceItemForm from "@/components/serviceItem/ServiceItemForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ComponentType } from "@/types/database";
import { useShopOwnerServiceItems } from "@/hooks/useServiceItems";
import { useNailArtistServiceItems } from "@/hooks/useNailArtistServiceItems";
import { useRequireRole } from "@/hooks/useRequireRole";

const CreateServiceItemPage = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { redirect, loading, user } = useRequireRole([1, 4]);

  const parsedType = parseInt(type || "0");
  const componentType: ComponentType =
    parsedType >= 0 && parsedType <= 4 ? (parsedType as ComponentType) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (redirect) return redirect;

  const isArtist = user.role === 4;
  const serviceItemsHook = isArtist
    ? useNailArtistServiceItems()
    : useShopOwnerServiceItems();

  const handleSubmit = async (formData: FormData) => {
    try {
      await serviceItemsHook.createServiceItem.mutateAsync(formData);
      navigate(-1);
    } catch (err) {
      console.error(err);
    }
  };

  const componentLabels = ["Base", "Shape", "Polish", "Design", "Gem"];

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
            <h1 className="text-2xl font-bold">
              Add {componentLabels[componentType]}
            </h1>
            <p className="text-muted-foreground">
              Create a new service item for your{" "}
              {isArtist ? "artist profile" : "shop"}
            </p>
          </div>
        </div>

        <ServiceItemForm
          componentType={componentType}
          onSubmit={handleSubmit}
          isLoading={serviceItemsHook.createServiceItem.isPending}
        />

        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="w-full"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CreateServiceItemPage;
