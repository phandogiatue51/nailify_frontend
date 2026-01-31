import { useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import {
  useCustomerShopById,
  useCustomerServiceItems,
  useCustomerCollections,
} from "@/hooks/useCustomer";
import { MapPin, Info, Star, Share2 } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, ShoppingBag, X } from "lucide-react";
import { ServiceItem } from "@/types/database";
import ServiceItemCard from "@/components/serviceItem/ServiceItemCard";
import CollectionCard from "@/components/collection/CollectionCard";
import { Link } from "react-router-dom";
const ShopDetailPage = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuthContext();
  const { data: shop, isLoading: shopLoading } = useCustomerShopById(shopId);
  const { groupedItems, isLoading: itemsLoading } =
    useCustomerServiceItems(shopId);
  const { data: collections, isLoading: collectionsLoading } =
    useCustomerCollections(shopId);
  const allItems: ServiceItem[] = (
    Object.values(groupedItems) as ServiceItem[][]
  ).flat();
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
      <div className="relative bg-slate-50/30 min-h-screen pb-32">
        {/* Immersive Header */}
        <div className="relative h-64 overflow-hidden">
          {shop.coverUrl ? (
            <img src={shop.coverUrl} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#FFC988] to-[#E288F9]" />
          )}
          <div className="absolute inset-0 bg-black/20" />{" "}
          {/* Subtle overlay for contrast */}
          <div className="absolute top-6 left-4 right-4 flex justify-between items-center">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-2xl bg-white/90 backdrop-blur"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5 text-slate-900" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-2xl bg-white/90 backdrop-blur"
            >
              <Share2 className="w-5 h-5 text-slate-900" />
            </Button>
          </div>
          <div className="absolute -bottom-1 left-0 right-0 h-8 bg-slate-50 rounded-t-[3rem]" />
        </div>

        {/* Shop Info Card */}
        <div className="px-6 -mt-16 relative z-10">
          <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 border border-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">
                  {shop.name}
                </h1>
              </div>
              {shop.logoUrl && (
                <img
                  src={shop.logoUrl}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-50 shadow-sm"
                />
              )}
            </div>

            <p className="text-sm text-slate-400 leading-relaxed italic">
              "{shop.description || "Welcome to our studio."}"
            </p>
          </div>
        </div>

        {/* Tabs System */}
        <div className="p-4 mt-4">
          <Tabs defaultValue="services" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-12 p-1 bg-white rounded-2xl mb-6 shadow-sm border border-slate-100">
              <TabsTrigger value="services" className="rounded-xl font-bold">
                Services
              </TabsTrigger>
              <TabsTrigger value="collections" className="rounded-xl font-bold">
                Lookbook
              </TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="space-y-4 mt-4">
              {itemsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : Object.values(groupedItems).flat().length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {allItems.map((item) => (
                    <Link key={item.id} to={`/services/${item.id}`}>
                      <ServiceItemCard item={item} />
                    </Link>
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
                    <Link
                      key={collection.id}
                      to={`/collections/${collection.id}`}
                    >
                      <CollectionCard collection={collection} />
                    </Link>
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
                  {totalPrice.toLocaleString()} VND
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
