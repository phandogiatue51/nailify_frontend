import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import {
  useAllCustomerServiceItems,
  useAllCustomerCollections,
} from "@/hooks/useCustomer";
import ServiceItemCard from "@/components/shop/ServiceItemCard";
import CollectionCard from "@/components/shop/CollectionCard";
import { Loader2, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
const Index = () => {
  const { user, loading } = useAuthContext();
  const { data: allServices = [], isLoading: servicesLoading } =
    useAllCustomerServiceItems();
  const { data: allCollections = [], isLoading: collectionsLoading } =
    useAllCustomerCollections();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialTab = params.get("tab") || "services";
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

  if (user?.role === 1) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <div className="pt-4">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Nailify</h1>
          </div>
          <p className="text-muted-foreground">
            Hi {user.fullName}! Find your perfect nail salon.
          </p>
        </div>

        <Tabs defaultValue={initialTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="mt-4">
            {servicesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : allServices && allServices.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {allServices.map((item) => (
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
          <TabsContent value="collections" className="mt-4">
            {collectionsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : allCollections && allCollections.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {allCollections.map((collection) => (
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
    </MobileLayout>
  );
};

export default Index;
