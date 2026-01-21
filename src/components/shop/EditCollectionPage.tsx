import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { useShop } from "@/hooks/useShop";
import { useShopOwnerServiceItems } from "@/hooks/useServiceItems"; // Changed
import {
  useShopOwnerCollectionById,
  useShopOwnerCollections,
} from "@/hooks/useCollections"; // Changed
import CollectionForm from "@/components/shop/CollectionForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Loader2 } from "lucide-react";

const EditCollectionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuthContext();
  const { myShop } = useShop();

  // Get service items for selection
  const { serviceItems, isLoading: itemsLoading } = useShopOwnerServiceItems();

  // Get specific collection
  const { data: collection, isLoading: collectionLoading } =
    useShopOwnerCollectionById(id);

  // Get update mutation
  const { updateCollection } = useShopOwnerCollections();

  if (loading || itemsLoading || collectionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user?.role !== 1) {
    return <Navigate to="/auth" replace />;
  }

  if (!myShop || !collection) {
    return <Navigate to="/my-shop" replace />;
  }

  // CollectionForm handles FormData creation internally
  const handleSubmit = async (formData: FormData) => {
    try {
      await updateCollection.mutateAsync({
        id: collection.id,
        formData,
      });
      navigate("/my-shop"); // Go back to shop page
    } catch (error) {
      console.error("Failed to update collection:", error);
    }
  };

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
            <h1 className="text-2xl font-bold">Edit Collection</h1>
            <p className="text-muted-foreground">Update collection details</p>
          </div>
        </div>

        <CollectionForm
          serviceItems={serviceItems || []}
          initialData={collection}
          onSubmit={handleSubmit}
          isLoading={updateCollection.isPending}
          // Remove initialSelectedItems and onItemsChange - CollectionForm handles them internally
        />

        <Button
          variant="outline"
          onClick={() => navigate("/my-shop")}
          className="w-full"
        >
          Cancel
        </Button>
      </div>
    </MobileLayout>
  );
};

export default EditCollectionPage;
