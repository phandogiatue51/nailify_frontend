import { useState } from "react";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import ShopList from "@/components/admin/shop/ShopList";
import ShopDetailModal from "@/components/admin/shop/ShopDetailModal";
import ShopFilter from "../../components/admin/shop/ShopFilter";
import { ShopFilterDto } from "@/types/filter";

const ShopsManagement = () => {
  const { user, loading } = useAuthContext();
  const [filters, setFilters] = useState<ShopFilterDto>({});
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user?.role !== 2) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Shops Management</h1>
          <p className="text-muted-foreground">Manage and verify shops</p>
        </div>
        <div className="text-sm text-muted-foreground">Admin Dashboard</div>
      </div>

      <ShopFilter filters={filters} onFilterChange={setFilters} />

      <div className="mt-6">
        <ShopList filters={filters} onShopSelect={setSelectedShopId} />
      </div>

      {selectedShopId && (
        <ShopDetailModal
          shopId={selectedShopId}
          open={!!selectedShopId}
          onClose={() => setSelectedShopId(null)}
        />
      )}
    </div>
  );
};

export default ShopsManagement;
