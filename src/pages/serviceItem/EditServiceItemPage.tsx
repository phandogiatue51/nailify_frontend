// pages/EditServiceItemPage.tsx
import { useParams, useNavigate, useLocation } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import ServiceItemForm from "@/components/serviceItem/ServiceItemForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { serviceItemAPI } from "@/services/api";
import { useRequireRole } from "@/hooks/useRequireRole";
import { useShopOwnerServiceItems } from "@/hooks/useServiceItems";
import { useNailArtistServiceItems } from "@/hooks/useNailArtistServiceItems";
const EditServiceItemPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { redirect, loading, user } = useRequireRole([1, 4]);
  const shopHook = useShopOwnerServiceItems();
  const artistHook = useNailArtistServiceItems();

  const { data: item, isLoading: itemLoading } = useQuery({
    queryKey: ["service-item", id],
    queryFn: async () => {
      if (!id) return null;
      return await serviceItemAPI.getById(id);
    },
    enabled: !!id,
  });

  if (redirect) return redirect;

  if (loading || itemLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isArtist = user?.role === 4;
  const serviceItemsHook = isArtist ? artistHook : shopHook;

  const handleSubmit = async (formData: FormData) => {
    try {
      await serviceItemsHook.updateServiceItem.mutateAsync({
        id: item.id,
        formData,
      });
      navigate(-1);
    } catch (err) {
      console.error(err);
    }
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
            <p className="text-muted-foreground">
              Update service item details for your{" "}
              {isArtist ? "artist profile" : "shop"}
            </p>
          </div>
        </div>

        <ServiceItemForm
          componentType={item.componentType}
          initialData={item}
          onSubmit={handleSubmit}
          isLoading={serviceItemsHook.updateServiceItem.isPending}
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
