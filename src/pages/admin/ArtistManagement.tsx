import { useState } from "react";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import ArtistFilter from "@/components/admin/nailArtist/ArtistFilter";
import ArtistDetailModal from "@/components/admin/nailArtist/ArtistDetailModal";
import { ArtistFilterDto } from "@/types/filter";
import ArtistList from "@/components/admin/nailArtist/ArtistList";
const ArtistsManagement = () => {
  const { user, loading } = useAuthContext();
  const [filters, setFilters] = useState<ArtistFilterDto>({});
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);

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
          <h1 className="text-2xl font-bold">Artists Management</h1>
          <p className="text-muted-foreground">
            Manage and verify nail artists
          </p>
        </div>
        <div className="text-sm text-muted-foreground">Admin Dashboard</div>
      </div>

      {/* Filter Section */}
      <ArtistFilter filters={filters} onFilterChange={setFilters} />

      {/* Artist List */}
      <div className="mt-6">
        <ArtistList filters={filters} onArtistSelect={setSelectedArtistId} />
      </div>

      {/* Artist Detail Modal */}
      {selectedArtistId && (
        <ArtistDetailModal
          artistId={selectedArtistId}
          open={!!selectedArtistId}
          onClose={() => setSelectedArtistId(null)}
          onArtistUpdated={() => {
            // Refresh artist list
            setSelectedArtistId(null);
          }}
        />
      )}
    </div>
  );
};

export default ArtistsManagement;
