import { useState } from "react";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { useShop } from "@/hooks/useShop";
import { useShopOwnerServiceItems } from "@/hooks/useServiceItems";
import { useShopOwnerCollections } from "@/hooks/useCollections";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Edit } from "lucide-react";
import { ComponentType } from "@/types/database";
import ShopForm from "@/components/shop/ShopForm";
import ServiceItemCard from "@/components/shop/ServiceItemCard";
import CollectionCard from "@/components/shop/CollectionCard";
import { useNavigate } from "react-router-dom";
import { useShopOwnerLocations } from "@/hooks/useLocation";
import { Trash } from "lucide-react";

const COMPONENT_TYPES: { value: ComponentType; label: string }[] = [
  { value: 0, label: "Forms" },
  { value: 1, label: "Bases" },
  { value: 2, label: "Shapes" },
  { value: 3, label: "Polish" },
  { value: 4, label: "Designs" },
];

const MyShopPage = () => {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();
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

  // No shop yet - show create form
  if (!myShop) {
    return (
      <MobileLayout>
        <div className="p-4 space-y-6">
          <div className="pt-4">
            <h1 className="text-2xl font-bold">Create Your Shop</h1>
            <p className="text-muted-foreground">Set up your nail salon</p>
          </div>
          <ShopForm
            onSubmit={async (formData) => {
              await createShop.mutateAsync(formData);
            }}
            isLoading={createShop.isPending}
          />
        </div>
      </MobileLayout>
    );
  }

  if (isEditingShop) {
    return (
      <MobileLayout>
        <div className="p-4 space-y-6">
          <div className="pt-4">
            <h1 className="text-2xl font-bold">Edit Shop</h1>
            <p className="text-muted-foreground">Update your shop details</p>
          </div>
          <ShopForm
            initialData={myShop}
            onSubmit={async (formData) => {
              await updateShop.mutateAsync({
                formData,
              });
              setTimeout(() => {
                refetchMyShop();
                setIsEditingShop(false);
              }, 500);
            }}
            isLoading={updateShop.isPending}
          />
          <Button
            variant="outline"
            onClick={() => setIsEditingShop(false)}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        {/* Shop Header */}
        <div className="pt-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{myShop.name}</h1>
            <p className="text-muted-foreground">{myShop.description}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditingShop(true)}
            className="flex items-center gap-1"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Shop</span>
          </Button>
        </div>

        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-4">
            {/* Service Type Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {COMPONENT_TYPES.map((type) => (
                <Button
                  key={type.value}
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigate(`/my-shop/service-items/create/${type.value}`)
                  }
                  className="whitespace-nowrap"
                >
                  {type.label}
                  {groupedItems && groupedItems[type.value]?.length > 0 && (
                    <span className="ml-1 text-xs">
                      ({groupedItems[type.value].length})
                    </span>
                  )}
                </Button>
              ))}
            </div>

            {/* Items List */}
            {itemsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : serviceItems && serviceItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {serviceItems.map((item) => (
                  <ServiceItemCard
                    key={item.id}
                    item={item}
                    showActions
                    onEdit={() =>
                      navigate(`/my-shop/service-items/edit/${item.id}`)
                    }
                    onDelete={() => handleDeleteItem(item.id)}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <p>No services added yet</p>
                  <p className="text-sm">Add your first one to get started</p>
                  <Button
                    onClick={() => navigate("/my-shop/service-items/create/0")}
                    className="mt-4"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Service
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="collections" className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/my-shop/collections/create")}
                className="whitespace-nowrap"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Collection
              </Button>
            </div>

            {collectionsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : collections && collections.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {collections.map((collection, index) => (
                  <CollectionCard
                    key={collection.id || index}
                    collection={collection}
                    showActions
                    onEdit={() =>
                      navigate(`/my-shop/collections/edit/${collection.id}`)
                    }
                    onDelete={() => handleDeleteCollection(collection.id)}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <p>No collections yet</p>
                  <p className="text-sm">Create a set of services</p>
                  <Button
                    onClick={() => navigate("/my-shop/collections/create")}
                    className="mt-4"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Collection
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="locations" className="space-y-4">
            <Button
              onClick={() => navigate("/my-shop/locations/create")}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Location
            </Button>

            {locationsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : locations && locations.length > 0 ? (
              <div className="space-y-3">
                {locations.map((location) => (
                  <Card key={location.shopLocationId}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{location.address}</h3>
                          {location.city && (
                            <p className="text-sm text-muted-foreground">
                              {location.city}
                            </p>
                          )}
                          {location.phone && (
                            <p className="text-sm">{location.phone}</p>
                          )}
                          {location.openingTime && location.closingTime && (
                            <p className="text-sm">
                              Hours: {location.openingTime} -{" "}
                              {location.closingTime}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(
                                `/my-shop/locations/edit/${location.shopLocationId}`,
                              )
                            }
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDeleteLocation(location.shopLocationId)
                            }
                          >
                            <Trash className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <p>No locations added yet</p>
                  <p className="text-sm">Add your shop location</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default MyShopPage;
