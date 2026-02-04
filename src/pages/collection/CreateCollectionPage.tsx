import { useNavigate, useLocation } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import CollectionForm from "@/components/collection/CollectionForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { serviceItemAPI } from "@/services/api";
import { useRequireRole } from "@/hooks/useRequireRole";
import { useNailArtistCollections } from "@/hooks/useNailArtistCollections";
import { useShopOwnerCollections } from "@/hooks/useCollections";
const CreateCollectionPage = () => {
  const navigate = useNavigate();
  const { redirect, loading, user } = useRequireRole([1, 4]);

  if (redirect) return redirect;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isArtist = user.role === 4;

  const { data: serviceItems = [], isLoading: itemsLoading } = useQuery({
    queryKey: [isArtist ? "artist-service-items" : "shop-owner-service-items"],
    queryFn: async () => {
      try {
        return isArtist
          ? await serviceItemAPI.getByArtistAuth()
          : await serviceItemAPI.getByShopAuth();
      } catch (error) {
        console.error("Error fetching service items:", error);
        return [];
      }
    },
  });

  const collectionsHook = isArtist
    ? useNailArtistCollections()
    : useShopOwnerCollections();

  const handleSubmit = async (formData: FormData) => {
    try {
      await collectionsHook.createCollection.mutateAsync(formData);
      navigate(isArtist ? "/my-artist" : "/my-shop");
    } catch (error) {
      console.error("Failed to create collection:", error);
    }
  };

  if (itemsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold">Create Collection</h1>
            <p className="text-muted-foreground">
              Group services together for your{" "}
              {isArtist ? "artist profile" : "shop"}
            </p>
          </div>
        </div>

        <CollectionForm
          serviceItems={serviceItems}
          onSubmit={handleSubmit}
          isLoading={collectionsHook.createCollection.isPending}
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

export default CreateCollectionPage;
