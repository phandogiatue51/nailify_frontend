import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { useAllShops } from "@/hooks/useShop";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import ShopCard from "@/components/shop/ShopCard";
import { Card, CardContent } from "@/components/ui/card";

const ExplorePage = () => {
  const { user, loading } = useAuth();
  const { data: shops, isLoading: shopsLoading } = useAllShops();
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <MobileLayout>
      <div className="p-4 space-y-4">
        <div className="pt-4">
          <h1 className="text-2xl font-bold">Explore</h1>
          <p className="text-muted-foreground">Find nail salons near you</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Results */}
        {shopsLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filteredShops.length > 0 ? (
          <div className="space-y-4">
            {filteredShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        ) : searchQuery ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <p>No shops found for "{searchQuery}"</p>
              <p className="text-sm">Try a different search term</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <p>No nail shops available</p>
              <p className="text-sm">Check back soon!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MobileLayout>
  );
};

export default ExplorePage;
