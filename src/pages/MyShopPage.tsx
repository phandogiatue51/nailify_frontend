import { useState } from "react";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { useShop } from "@/hooks/useShop";
import { useServiceItems } from "@/hooks/useServiceItems";
import { useCollections } from "@/hooks/useCollections";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Store, Edit } from "lucide-react";
import { ComponentType } from "@/types/database";
import ShopForm from "@/components/shop/ShopForm";
import ServiceItemForm from "@/components/shop/ServiceItemForm";
import CollectionForm from "@/components/shop/CollectionForm";
import ServiceItemCard from "@/components/shop/ServiceItemCard";
import CollectionCard from "@/components/shop/CollectionCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const COMPONENT_TYPES: { value: ComponentType; label: string }[] = [
  { value: "Form", label: "Forms" },
  { value: "Base", label: "Bases" },
  { value: "Shape", label: "Shapes" },
  { value: "Polish", label: "Polish" },
  { value: "Design", label: "Designs" },
];

const MyShopPage = () => {
  const { user, loading } = useAuthContext();
  const { myShop, shopLoading, createShop, updateShop } = useShop();
  const {
    serviceItems,
    groupedItems,
    isLoading: itemsLoading,
    createServiceItem,
    updateServiceItem,
    deleteServiceItem,
  } = useServiceItems(myShop?.id);
  const {
    collections,
    isLoading: collectionsLoading,
    createCollection,
    updateCollection,
    deleteCollection,
  } = useCollections(myShop?.id);

  const [showShopForm, setShowShopForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showCollectionForm, setShowCollectionForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingCollection, setEditingCollection] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<ComponentType>("Form");

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

  if (user?.role !== "ShopOwner") {
    return <Navigate to="/" replace />;
  }

  const handleCreateItem = async (data: any) => {
    if (!myShop) return;
    await createServiceItem.mutateAsync({
      ...data,
      shop_id: myShop.id,
    });
    setShowItemForm(false);
  };

  const handleUpdateItem = async (data: any) => {
    await updateServiceItem.mutateAsync({
      id: editingItem.id,
      ...data,
    });
    setEditingItem(null);
  };

  const handleDeleteItem = async (id: string) => {
    await deleteServiceItem.mutateAsync(id);
  };

  const handleCreateCollection = async (data: any) => {
    if (!myShop) return;
    await createCollection.mutateAsync({
      collection: {
        ...data,
        shop_id: myShop.id,
      },
      itemIds: data.itemIds || [],
    });
    setShowCollectionForm(false);
  };

  const handleUpdateCollection = async (data: any) => {
    await updateCollection.mutateAsync({
      id: editingCollection.id,
      collection: data,
      itemIds: data.itemIds,
    });
    setEditingCollection(null);
  };

  const handleDeleteCollection = async (id: string) => {
    await deleteCollection.mutateAsync(id);
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

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        {/* Shop Header */}
        <div className="pt-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{myShop.name}</h1>
            <p className="text-muted-foreground">
              {myShop.address || "No address set"}
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowShopForm(true)}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>

        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-4">
            {/* Service Type Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {COMPONENT_TYPES.map((type) => (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type.value)}
                  className="whitespace-nowrap"
                >
                  {type.label}
                  {groupedItems[type.value]?.length > 0 && (
                    <span className="ml-1 text-xs">
                      ({groupedItems[type.value].length})
                    </span>
                  )}
                </Button>
              ))}
            </div>

            {/* Add Button */}
            <Button onClick={() => setShowItemForm(true)} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add{" "}
              {COMPONENT_TYPES.find(
                (t) => t.value === selectedType,
              )?.label.slice(0, -1)}
            </Button>

            {/* Items List */}
            {itemsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : groupedItems[selectedType]?.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {groupedItems[selectedType].map((item) => (
                  <ServiceItemCard
                    key={item.id}
                    item={item}
                    showActions
                    onEdit={() => setEditingItem(item)}
                    onDelete={() => handleDeleteItem(item.id)}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <p>No {selectedType}s added yet</p>
                  <p className="text-sm">Add your first one to get started</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="collections" className="space-y-4">
            <Button
              onClick={() => setShowCollectionForm(true)}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Collection
            </Button>

            {collectionsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : collections && collections.length > 0 ? (
              <div className="space-y-4">
                {collections.map((collection) => (
                  <CollectionCard
                    key={collection.id}
                    collection={collection}
                    showActions
                    onEdit={() => setEditingCollection(collection)}
                    onDelete={() => handleDeleteCollection(collection.id)}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <p>No collections yet</p>
                  <p className="text-sm">Create a set of services</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Shop Edit Dialog */}
        <Dialog open={showShopForm} onOpenChange={setShowShopForm}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Shop</DialogTitle>
            </DialogHeader>
            <ShopForm
              initialData={myShop}
              onSubmit={async (formData) => {
                await updateShop.mutateAsync({
                  id: myShop.id,
                  formData,
                });
              }}
              isLoading={updateShop.isPending}
            />
          </DialogContent>
        </Dialog>

        {/* Service Item Form Dialog */}
        <Dialog open={showItemForm} onOpenChange={setShowItemForm}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add {selectedType}</DialogTitle>
            </DialogHeader>
            <ServiceItemForm
              componentType={selectedType}
              onSubmit={handleCreateItem}
              isLoading={createServiceItem.isPending}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Service Item Dialog */}
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit {editingItem?.component_type}</DialogTitle>
            </DialogHeader>
            {editingItem && (
              <ServiceItemForm
                componentType={editingItem.component_type}
                initialData={editingItem}
                onSubmit={handleUpdateItem}
                isLoading={updateServiceItem.isPending}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Collection Form Dialog */}
        <Dialog open={showCollectionForm} onOpenChange={setShowCollectionForm}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Collection</DialogTitle>
            </DialogHeader>
            <CollectionForm
              serviceItems={serviceItems || []}
              onSubmit={handleCreateCollection}
              isLoading={createCollection.isPending}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Collection Dialog */}
        <Dialog
          open={!!editingCollection}
          onOpenChange={() => setEditingCollection(null)}
        >
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Collection</DialogTitle>
            </DialogHeader>
            {editingCollection && (
              <CollectionForm
                serviceItems={serviceItems || []}
                initialData={editingCollection}
                onSubmit={handleUpdateCollection}
                isLoading={updateCollection.isPending}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MobileLayout>
  );
};

export default MyShopPage;
