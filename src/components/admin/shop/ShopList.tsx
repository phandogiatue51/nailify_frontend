import { useState, useEffect } from "react";
import { Shop } from "@/types/database";
import { ShopFilterDto } from "@/types/filter";
import { shopAPI } from "@/services/api";
import ShopCard from "./ShopCard";
import { PaginationWrapper } from "@/components/ui/PaginationWrapper";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";

interface ShopListProps {
  filters: ShopFilterDto;
  onShopSelect: (shopId: string) => void;
}

export const ShopList = ({ filters, onShopSelect }: ShopListProps) => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const loadShops = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await shopAPI.adminFilter(filters);
      setShops(data);
    } catch (err) {
      setError("Failed to load shops");
      console.error("Error loading shops:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShops();
    setPage(1);
  }, [filters]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={loadShops}
            className="ml-4"
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (shops.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground" />
        <div>
          <h3 className="text-lg font-medium">No shops found</h3>
          <p className="text-muted-foreground mt-1">
            {Object.keys(filters).length > 0
              ? "Try adjusting your filters"
              : "No shops available yet"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <PaginationWrapper
      items={shops}
      currentPage={page}
      pageSize={9}
      onPageChange={setPage}
      renderItem={(shop) => (
        <ShopCard shop={shop} onViewDetails={() => onShopSelect(shop.id)} />
      )}
    />
  );
};

export default ShopList;
