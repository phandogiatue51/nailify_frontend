import { useParams } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { useCustomerArtistById } from "@/hooks/useCustomer";
import {
  useCustomerServiceItems,
  useCustomerCollections,
} from "@/hooks/useCustomer";
import { Loader2, MapPin, Star, User, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServiceItemCard from "@/components/serviceItem/ServiceItemCard";
import CollectionCard from "@/components/collection/CollectionCard";
import { Card, CardContent } from "@/components/ui/card";

const ArtistDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuthContext();
  const { data: artist, isLoading: artistLoading } = useCustomerArtistById(id);
  const { serviceItems = [], isLoading: servicesLoading } =
    useCustomerServiceItems(undefined, id);
  const { data: collections = [], isLoading: collectionsLoading } =
    useCustomerCollections(undefined, id);

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

  if (artistLoading) {
    return (
      <MobileLayout>
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </MobileLayout>
    );
  }

  if (!artist) {
    return <Navigate to="/explore" replace />;
  }

  const isLoading = servicesLoading || collectionsLoading;

  return (
    <MobileLayout>
      <div className="space-y-6">
        {/* Artist Header */}
        <div className="relative">
          {/* Cover/Profile Image */}
          <div className="aspect-[16/9] bg-gradient-to-r from-pink-100 to-purple-100" />

          <div className="px-4 pb-4">
            <div className="relative -mt-12 flex items-end gap-4">
              <div className="w-24 h-24 rounded-full border-4 border-background bg-muted overflow-hidden">
                {artist.profile?.avatarUrl ? (
                  <img
                    src={artist.profile.avatarUrl}
                    alt={artist.profile.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">
                    {artist.profile?.fullName}
                  </h1>
                  {artist.rating !== undefined && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">
                        {artist.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-2">
                  {artist.isVerified && (
                    <Badge className="bg-green-500">Verified Artist</Badge>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {serviceItems.length} services
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mt-4">
              {artist.address && (
                <p className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  {artist.address}
                </p>
              )}
              {artist.profile?.phone && (
                <p className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  {artist.profile.phone}
                </p>
              )}
              {artist.profile?.email && (
                <p className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  {artist.profile.email}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="px-4">
          <Tabs defaultValue="services" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="collections">Collections</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="space-y-4 mt-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : serviceItems.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {serviceItems.map((item) => (
                    <ServiceItemCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <p>No services available yet</p>
                    <p className="text-sm">Check back later</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="collections" className="space-y-4 mt-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : collections.length > 0 ? (
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
                    <p>No collections available yet</p>
                    <p className="text-sm">Check back later</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Book Button */}
          <div className="mt-6">
            <Button className="w-full" size="lg">
              Book Appointment
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ArtistDetailPage;
