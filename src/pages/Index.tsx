import { useAuth } from '../hooks/use-auth';
import { Navigate } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import { useAllShops } from '@/hooks/useShop';
import ShopCard from '@/components/shop/ShopCard';
import { Loader2, Sparkles } from 'lucide-react';

const Index = () => {
  const { user, profile, loading } = useAuth();
  const { data: shops, isLoading: shopsLoading } = useAllShops();

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

  if (profile?.role === 'ShopOwner') {
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
            Hi {profile?.fullName?.split(' ')[0]}! Find your perfect nail salon.
          </p>
        </div>

        <section>
          <h2 className="text-lg font-semibold mb-3">Popular Shops</h2>
          {shopsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : shops && shops.length > 0 ? (
            <div className="space-y-4">
              {shops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No nail shops available yet.</p>
              <p className="text-sm">Check back soon!</p>
            </div>
          )}
        </section>
      </div>
    </MobileLayout>
  );
};

export default Index;
