import { useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import MobileLayout from "@/components/layout/MobileLayout";
import {
  useCustomerArtistById,
  useCustomerServiceItems,
  useCustomerCollections,
} from "@/hooks/useCustomer";
import {
  ArrowLeft,
  Loader2,
  MapPin,
  Star,
  User,
  Phone,
  MessageCircle,
  Heart,
  ShoppingBag,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import ServiceItemCard from "@/components/serviceItem/ServiceItemCard";
import CollectionCard from "@/components/collection/CollectionCard";
import { ServiceItem } from "@/types/database";

const ArtistDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuthContext();

  const { data: artist, isLoading: artistLoading } = useCustomerArtistById(id);
  const { serviceItems = [], isLoading: servicesLoading } =
    useCustomerServiceItems(undefined, id);
  const { data: collections = [], isLoading: collectionsLoading } =
    useCustomerCollections(undefined, id);
  const [selectedItems, setSelectedItems] = useState<ServiceItem[]>([]);

  if (loading || artistLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#E288F9]" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!artist) return <Navigate to="/explore" replace />;

  const toggleItem = (item: ServiceItem) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      return exists ? prev.filter((i) => i.id !== item.id) : [...prev, item];
    });
  };

  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + Number(item.price),
    0,
  );

  const handleBookNow = () => {
    navigate(`/book`, {
      state: {
        selectedItems,
        id,
        type: "artist",
      },
    });
  };

  return (
    <MobileLayout showNav={false}>
      <div className="bg-white min-h-screen pb-32">
        <div className="relative h-72">
          <div className="absolute inset-0 bg-gradient-to-b from-[#E288F9]/20 to-transparent" />
          <img
            src={artist.avatarUrl || "/placeholder-artist.jpg"}
            className="w-full h-full object-cover"
            alt={artist.fullName}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/10" />

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-6 left-4 bg-white/40 backdrop-blur-md rounded-2xl"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5 text-slate-900" />
          </Button>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-[#FFC988] text-slate-900 font-black border-none text-[10px]">
                {artist.isVerified ? "VERIFIED PRO" : "ARTIST"}
              </Badge>
              <div className="flex items-center gap-1 bg-white/80 backdrop-blur px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-[10px] font-black">
                  {artist.rating?.toFixed(1) || "0.0"}
                </span>
              </div>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
              {artist.fullName}
            </h1>
          </div>
        </div>

        {/* 2. ACTION BAR */}
        <div className="flex gap-3 px-6 -mt-4 relative z-20">
          <Button className="flex-1 h-12 rounded-2xl bg-[#E288F9] shadow-lg shadow-purple-100 font-bold border-none hover:bg-[#d07ae6]">
            <MessageCircle className="w-4 h-4 mr-2" /> Chat
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-2xl border-slate-100 bg-white shadow-sm font-bold"
          >
            <Phone className="w-4 h-4 mr-2" /> Call
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-2xl border-slate-100 bg-white shadow-sm"
          >
            <Heart className="w-4 h-4 text-pink-500" />
          </Button>
        </div>

        {/* 3. TABS CONTENT */}
        <div className="px-4 mt-8">
          <Tabs defaultValue="services" className="w-full">
            <TabsList className="bg-transparent gap-8 border-b border-slate-100 rounded-none h-auto p-0 mb-6 w-full justify-start">
              <TabsTrigger
                value="services"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#E288F9] rounded-none px-0 pb-2 font-black text-xs uppercase tracking-widest text-slate-400 data-[state=active]:text-slate-900"
              >
                Services
              </TabsTrigger>
              <TabsTrigger
                value="collections"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#E288F9] rounded-none px-0 pb-2 font-black text-xs uppercase tracking-widest text-slate-400 data-[state=active]:text-slate-900"
              >
                Lookbook
              </TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="space-y-4 m-0">
              {servicesLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-[#E288F9]" />
                </div>
              ) : serviceItems.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {serviceItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item)}
                      className="cursor-pointer"
                    >
                      <ServiceItemCard
                        item={item}
                        selected={selectedItems.some((i) => i.id === item.id)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="py-10 text-center text-slate-400 text-sm">
                    No services listed yet.
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="collections" className="m-0">
              {collectionsLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-[#E288F9]" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {collections.map((collection) => (
                    <CollectionCard
                      key={collection.id}
                      collection={collection}
                    />
                  ))}
                </div>
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

export default ArtistDetailPage;
