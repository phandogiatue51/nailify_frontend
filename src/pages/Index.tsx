"use client";

import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate, useLocation, Link } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import {
  useAllCustomerServiceItems,
  useAllCustomerCollections,
} from "@/hooks/useCustomer";
import ServiceItemCard from "@/components/serviceItem/ServiceItemCard";
import CollectionCard from "@/components/collection/CollectionCard";
import { Loader2, Search, Bell } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-[#E288F9]" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (user?.role === 1) return <Navigate to="/staff-dashboard" replace />;
  if (user?.role === 4) return <Navigate to="/artist-dashboard" replace />;

  return (
    <MobileLayout>
      <div className="min-h-screen bg-slate-50/50 pb-20">
        {/* Facebook-Style Sticky Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <h1
              className="text-2xl font-black italic tracking-tighter bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(to right, #FFC988, #E288F9)",
              }}
            >
              Nailify
            </h1>
            <div className="flex gap-2">
              <button className="p-2 bg-slate-100 rounded-full">
                <Search className="w-5 h-5 text-slate-600" />
              </button>
              <button className="p-2 bg-slate-100 rounded-full relative">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full border-2 border-white" />
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 space-y-6">
          {/* Welcome Section */}
          <div className="py-2">
            <h2 className="text-xl font-bold text-slate-900">
              Hi, {user?.fullName}
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Ready for a fresh set of nails?
            </p>
          </div>

          <Tabs defaultValue={initialTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-12 p-1 bg-slate-200/40 rounded-2xl mb-6">
              <TabsTrigger
                value="services"
                className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Services
              </TabsTrigger>
              <TabsTrigger
                value="collections"
                className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Collections
              </TabsTrigger>
            </TabsList>

            {/* Services View */}
            <TabsContent
              value="services"
              className="animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              {servicesLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-[#FFC988]" />
                </div>
              ) : allServices.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {allServices.map((item) => (
                    <Link
                      key={item.id}
                      to={`/services/${item.id}`}
                      className="block transform active:scale-95 transition-transform"
                    >
                      <ServiceItemCard item={item} />
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState message="No services found nearby" />
              )}
            </TabsContent>

            {/* Collections View */}
            <TabsContent
              value="collections"
              className="animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              {collectionsLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-[#E288F9]" />
                </div>
              ) : allCollections.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {allCollections.map((collection) => (
                    <Link
                      key={collection.id}
                      to={`/collections/${collection.id}`}
                      className="block transform active:scale-95 transition-transform"
                    >
                      <CollectionCard collection={collection} />
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState message="No collections available" />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MobileLayout>
  );
};

/* Internal Helper for Cleaner Code */
const EmptyState = ({ message }: { message: string }) => (
  <Card className="border-dashed border-2 bg-transparent">
    <CardContent className="py-12 text-center">
      <p className="text-slate-400 font-medium text-sm">{message}</p>
    </CardContent>
  </Card>
);

export default Index;
