import { useState } from "react";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { useShop } from "@/hooks/useShop";
import { useShopOwnerServiceItems } from "@/hooks/useServiceItems";
import { useShopOwnerCollections } from "@/hooks/useCollections";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Edit } from "lucide-react";
import { useShopOwnerLocations } from "@/hooks/useLocation";
import { ShopSetupView } from "./ShopSetUpView";
import { ServicesTab } from "@/components/shop/ServicesTab";
import { LocationsTab } from "@/components/shop/LocationsTab";
import { CollectionsTab } from "@/components/shop/CollectionsTab";
import ShopEditView from "./ShopEditView";
import Header from "@/components/ui/header";
const MyShopPage = () => {
  const { user, loading } = useAuthContext();
  const { myShop, shopLoading, createShop, updateShop, refetchMyShop } =
    useShop();
  const {
    locations,
    isLoading: locationsLoading,
    deleteLocation,
  } = useShopOwnerLocations();

  const {
    serviceItems,
    groupedItems,
    isLoading: itemsLoading,
    deleteServiceItem,
  } = useShopOwnerServiceItems();

  const {
    collections,
    isLoading: collectionsLoading,
    deleteCollection,
  } = useShopOwnerCollections();

  const [isEditingShop, setIsEditingShop] = useState(false);

  if (loading || shopLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (user?.role !== 1) {
    return <Navigate to="/" replace />;
  }

  const handleDeleteItem = async (id: string) => {
    await deleteServiceItem.mutateAsync(id);
  };

  const handleDeleteCollection = async (id: string) => {
    await deleteCollection.mutateAsync(id);
  };

  const handleDeleteLocation = async (shopLocationId: string) => {
    await deleteLocation.mutateAsync(shopLocationId);
  };

  if (!myShop) {
    return (
      <div>
        <ShopSetupView
          onSubmit={(data) => createShop.mutateAsync(data)}
          isLoading={createShop.isPending}
        />
      </div>
    );
  }

  if (isEditingShop) {
    return (
      <div>
        <ShopEditView
          myShop={myShop}
          onCancel={() => setIsEditingShop(false)}
          onSubmit={async (formData) => {
            await updateShop.mutateAsync({ formData });
            refetchMyShop();
            setIsEditingShop(false);
          }}
          isLoading={updateShop.isPending}
        />
      </div>
    );
  }
  return (
    <div>
      <Header title="Nailify"/>

      <div className="p-4 space-y-6 bg-slate-50/30 min-h-screen">
        <header className="pt-4 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              {myShop.name}
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              {myShop.description}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditingShop(true)}
            className="rounded-2xl bg-white shadow-sm border border-slate-100"
          >
            <Edit className="w-4 h-4 text-slate-600" />
          </Button>
        </header>

        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-12 p-1 bg-slate-200/50 rounded-2xl mb-6">
            <TabsTrigger value="services" className="rounded-xl font-bold">
              Services
            </TabsTrigger>
            <TabsTrigger value="collections" className="rounded-xl font-bold">
              Collections
            </TabsTrigger>
            <TabsTrigger value="locations" className="rounded-xl font-bold">
              Locations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <ServicesTab
              groupedItems={groupedItems}
              serviceItems={serviceItems}
              isLoading={itemsLoading}
              onDelete={handleDeleteItem}
            />
          </TabsContent>

          <TabsContent value="collections">
            <CollectionsTab
              collections={collections}
              isLoading={collectionsLoading}
              onDelete={handleDeleteCollection}
            />
          </TabsContent>

          <TabsContent value="locations">
            <LocationsTab
              locations={locations}
              isLoading={locationsLoading}
              onDelete={handleDeleteLocation}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyShopPage;
