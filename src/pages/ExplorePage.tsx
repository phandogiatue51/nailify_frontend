// pages/ExplorePage.tsx
import { useState } from "react";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { useAllShops } from "@/hooks/useShop";
import { useCustomerArtists } from "@/hooks/useCustomer";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, User, Store } from "lucide-react";
import ShopCard from "@/components/shop/ShopCard";
import NailArtistCard from "@/components/nailArtist/NailArtistCard";
import { Card, CardContent } from "@/components/ui/card";

const ExplorePage = () => {
  const { user, loading } = useAuthContext();
  const { data: shops, isLoading: shopsLoading } = useAllShops();
  const { data: artists, isLoading: artistsLoading } = useCustomerArtists();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("shops");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Filter shops by search query
  const filteredShops =
    shops?.filter(
      (shop) =>
        shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.address?.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  // Filter artists by search query
  const filteredArtists =
    artists?.filter(
      (artist) =>
        artist.profile?.fullName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        artist.address?.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  const isLoading = activeTab === "shops" ? shopsLoading : artistsLoading;
  const showEmptyState =
    activeTab === "shops"
      ? filteredShops.length === 0
      : filteredArtists.length === 0;

  return (
    <MobileLayout>
      <div className="p-4 space-y-4">
        <div className="pt-4">
          <h1 className="text-2xl font-bold">Explore</h1>
          <p className="text-muted-foreground">
            Find nail salons and artists near you
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${activeTab === "shops" ? "shops" : "artists"}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="shops" className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              <span>Shops</span>
            </TabsTrigger>
            <TabsTrigger value="artists" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Artists</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shops" className="space-y-4 mt-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : filteredShops.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredShops.map((shop) => (
                  <ShopCard key={shop.id} shop={shop} />
                ))}
              </div>
            ) : showEmptyState ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <p>
                    {searchQuery
                      ? `No shops found for "${searchQuery}"`
                      : "No nail shops available"}
                  </p>
                  <p className="text-sm">
                    {searchQuery
                      ? "Try a different search term"
                      : "Check back soon!"}
                  </p>
                </CardContent>
              </Card>
            ) : null}
          </TabsContent>

          <TabsContent value="artists" className="space-y-4 mt-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : filteredArtists.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredArtists.map((artist) => (
                  <NailArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            ) : showEmptyState ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <p>
                    {searchQuery
                      ? `No artists found for "${searchQuery}"`
                      : "No nail artists available"}
                  </p>
                  <p className="text-sm">
                    {searchQuery
                      ? "Try a different search term"
                      : "Check back soon!"}
                  </p>
                </CardContent>
              </Card>
            ) : null}
          </TabsContent>
        </Tabs>

        <div className="text-xs text-muted-foreground text-center pt-2">
          <p>
            Found {filteredShops.length} shops and {filteredArtists.length}{" "}
            artists
          </p>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ExplorePage;
