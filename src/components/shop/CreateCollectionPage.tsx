import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { useShop } from "@/hooks/useShop";
import { useShopOwnerServiceItems } from "@/hooks/useServiceItems";
import { useShopOwnerCollections } from "@/hooks/useCollections";
import CollectionForm from "@/components/shop/CollectionForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Loader2 } from "lucide-react";

const CreateCollectionPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuthContext();
  const { myShop } = useShop();

  // Get service items for selection
  const { serviceItems, isLoading: itemsLoading } = useShopOwnerServiceItems();

  // Get collection mutation
  const { createCollection } = useShopOwnerCollections();

  if (loading || itemsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user?.role !== 1) {
    return <Navigate to="/auth" replace />;
  }

  if (!myShop) {
    return <Navigate to="/my-shop" replace />;
  }

  // CollectionForm handles FormData creation internally
  const handleSubmit = async (formData: FormData) => {
    try {
      await createCollection.mutateAsync(formData);
      navigate("/my-shop"); // Go back to shop page
    } catch (error) {
      console.error("Failed to create collection:", error);
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
            <h1 className="text-2xl font-bold">Create Collection</h1>
            <p className="text-muted-foreground">Group services together</p>
          </div>
        </div>

        {/* REMOVED onItemsChange prop */}
        <CollectionForm
          serviceItems={serviceItems || []}
          onSubmit={handleSubmit}
          isLoading={createCollection.isPending}
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

export default CreateCollectionPage;
