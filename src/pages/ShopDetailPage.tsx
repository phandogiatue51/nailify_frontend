import { useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import {
  useCustomerShopById,
  useCustomerServiceItems,
  useCustomerCollections,
} from "@/hooks/useCustomer";

import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, ShoppingBag, X } from "lucide-react";
import { ServiceItem } from "@/types/database";
import ServiceItemCard from "@/components/shop/ServiceItemCard";
import CollectionCard from "@/components/shop/CollectionCard";

const ShopDetailPage = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuthContext();
  const { data: shop, isLoading: shopLoading } = useCustomerShopById(shopId);
  const { groupedItems, isLoading: itemsLoading } =
    useCustomerServiceItems(shopId);
  const { data: collections, isLoading: collectionsLoading } =
    useCustomerCollections(shopId);
  const allItems: ServiceItem[] = (Object.values(groupedItems) as ServiceItem[][]).flat();
  const [selectedItems, setSelectedItems] = useState<ServiceItem[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>();

  const COMPONENT_TYPES = [
    { value: 0, label: "Forms" },
    { value: 1, label: "Bases" },
    { value: 2, label: "Shapes" },
    { value: 3, label: "Polish" },
    { value: 4, label: "Designs" },
  ];

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

  if (!shop) {
    return <Navigate to="/" replace />;
  }

  const toggleItem = (item: ServiceItem) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const handleBookNow = () => {
    navigate(`/shops/${shopId}/book`, {
      state: {
        selectedItems,
        selectedCollection,
      },
    });
  };

  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + Number(item.price),
    0,
  );

  return (
    <MobileLayout showNav={false}>
      <div className="relative">
        {/* Header Image */}
        <div className="relative">
          {/* Cover */}
          <div className="h-48 bg-muted relative">
            {shop.coverUrl ? (
              <img
                src={shop.coverUrl}
                alt={shop.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
            )}

            {/* Back button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 left-4 bg-background/80 backdrop-blur"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>

          {/* Logo/avatar overlay */}
          {shop.logoUrl && (
            <div className="absolute -bottom-8 left-6">
              <img
                src={shop.logoUrl}
                alt={shop.name}
                className="w-20 h-20 rounded-xl object-cover border-4 border-background shadow-md"
              />
            </div>
          )}
        </div>

        {/* Shop Info */}
        <div className="p-4 mt-10 space-y-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">{shop.name}</h1>
            {shop.description && (
              <p className="text-muted-foreground text-sm mt-1">
                {shop.description}
              </p>
            )}
          </div>
        </div>


        {/* Services & Collections */}
        <div className="p-4">
          <Tabs defaultValue="services">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="collections">Collections</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="space-y-4 mt-4">
              {itemsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : Object.values(groupedItems).flat().length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {allItems.map((item) => (
                    <ServiceItemCard key={item.id} item={item} onSelect={() => toggleItem(item)}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <p>No services available</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Collections Tab */}
            <TabsContent value="collections" className="space-y-4 mt-4">
              {collectionsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : collections && collections.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {collections.map((collection) => (
                    <CollectionCard
                      key={collection.id}
                      collection={collection}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <p>No collections available</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>


        {selectedItems.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-semibold">
                  {selectedItems.length} items selected
                </p>
                <p className="text-lg font-bold text-primary">
                  ${totalPrice.toFixed(2)}
                </p>
              </div>
              <Button onClick={handleBookNow}>
                <ShoppingBag className="w-4 h-4 mr-2" />
                Book Now
              </Button>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {selectedItems.map((item) => (
                <Badge
                  key={item.id}
                  variant="secondary"
                  className="whitespace-nowrap"
                >
                  {item.name}
                  <button
                    onClick={() => toggleItem(item)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default ShopDetailPage;