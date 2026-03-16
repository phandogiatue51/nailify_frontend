import { useState, useEffect } from "react";
import { Collection } from "@/types/database";
import { CollectionFilterDto } from "@/types/filter";
import { collectionAPI } from "@/services/api";
import CollectionCard from "./CollectionCard";
import { PaginationWrapper } from "@/components/ui/PaginationWrapper";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, Layers } from "lucide-react";

interface CollectionListProps {
  filters: CollectionFilterDto;
  onCollectionSelect: (collectionId: string) => void;
}

export const CollectionList = ({
  filters,
  onCollectionSelect,
}: CollectionListProps) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const loadCollections = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await collectionAPI.adminFilter(filters);
      setCollections(data);
    } catch (err) {
      setError("Failed to load collections");
      console.error("Error loading collections:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollections();
    setPage(1); // Reset to page 1 when filters change
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
            onClick={loadCollections}
            className="ml-4"
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <Layers className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
        <div className="space-y-1">
          <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase">
            Không tìm thấy kết quả
          </h3>
          <p className="text-sm font-medium text-muted-foreground">
            {Object.keys(filters).length > 0
              ? "Hãy thử điều chỉnh lại bộ lọc để tìm thấy bộ sưu tập mong muốn"
              : "Hiện tại chưa có bộ sưu tập nào khả dụng"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <PaginationWrapper
      items={collections}
      currentPage={page}
      pageSize={12}
      onPageChange={setPage}
      renderItem={(collection) => (
        <CollectionCard
          key={collection.id}
          collection={collection}
          onViewDetails={() => onCollectionSelect(collection.id)}
        />
      )}
      gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    />
  );
};

export default CollectionList;
