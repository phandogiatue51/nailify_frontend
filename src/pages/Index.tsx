"use client";

import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate, useLocation, Link } from "react-router-dom";
import {
  useAllCustomerServiceItems,
  useAllCustomerCollections,
} from "@/hooks/useCustomer";
import CollectionCard from "@/components/collection/CollectionCard";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/ui/header";
const Index = () => {
  const { user, loading } = useAuthContext();
  const { data: allCollections = [], isLoading: collectionsLoading } =
    useAllCustomerCollections();

  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-[#E288F9]" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;

  switch (user.role) {
    case 1:
      return <Navigate to="/shop-dashboard" replace />;
    case 2:
      return <Navigate to="/admin" replace />;
    case 3:
      return <Navigate to="/staff-dashboard" replace />;
    case 4:
      return <Navigate to="/artist-dashboard" replace />;
    case 0:
    default:
      break;
  }
  return (
    <div>
      <div className="min-h-screen bg-slate-50/50 pb-20">
        <Header title="Nailify" hasNotification={true} />

        <div className="p-4 space-y-6">
          <div className="py-2">
            <h2 className="text-xl font-bold text-slate-900">
              Hi, {user?.fullName}
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Ready for a fresh set of nails?
            </p>
          </div>

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
        </div>
      </div>
    </div>
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
