import { useState } from "react";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { CollectionFilterDto } from "@/types/filter";
import CollectionFilter from "@/components/admin/collection/CollectionFilter";
import CollectionList from "@/components/admin/collection/CollectionList";
import CollectionDetailModal from "@/components/admin/collection/CollectionDetailModal";

const CollectionsManagement = () => {
  const { user, loading } = useAuthContext();
  const [filters, setFilters] = useState<CollectionFilterDto>({});
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);

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
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
            Quản lý <span className="text-[#950101]">Bộ sưu tập</span>
          </h1>
          <p className="text-sm font-bold text-slate-400 italic mt-1">
            Tìm kiếm các bộ sưu tập do cửa hàng và thợ nail phát hành
          </p>
        </div>
      </div>

      <div className="mb-6">
        <CollectionFilter filters={filters} onFilterChange={setFilters} />
      </div>

      <div>
        <CollectionList
          filters={filters}
          onCollectionSelect={setSelectedCollectionId}
        />
      </div>

      {selectedCollectionId && (
        <CollectionDetailModal
          collectionId={selectedCollectionId}
          open={!!selectedCollectionId}
          onClose={() => setSelectedCollectionId(null)}
        />
      )}
    </div>
  );
};

export default CollectionsManagement;
