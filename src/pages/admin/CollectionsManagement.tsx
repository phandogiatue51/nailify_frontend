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
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Collections Management</h1>
          <p className="text-muted-foreground">
            Browse and manage all collections
          </p>
        </div>
        <div className="text-sm text-muted-foreground">Admin Dashboard</div>
      </div>

      {/* Filter Section */}
      <CollectionFilter filters={filters} onFilterChange={setFilters} />

      {/* Collection List */}
      <div className="mt-6">
        <CollectionList
          filters={filters}
          onCollectionSelect={setSelectedCollectionId}
        />
      </div>

      {/* Collection Detail Modal */}
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
