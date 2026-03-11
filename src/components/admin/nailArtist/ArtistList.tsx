// pages/admin/artists/components/ArtistList.tsx
import { useState, useEffect } from "react";
import { NailArtist } from "@/types/database";
import { ArtistFilterDto } from "@/types/filter";
import { artistAPI } from "@/services/api";
import ArtistCard from "./ArtistCard";
import { PaginationWrapper } from "@/components/ui/PaginationWrapper";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";

interface ArtistListProps {
  filters: ArtistFilterDto;
  onArtistSelect: (artistId: string) => void;
  onArtistsUpdated?: () => void;
}

export const ArtistList = ({
  filters,
  onArtistSelect,
  onArtistsUpdated,
}: ArtistListProps) => {
  const [artists, setArtists] = useState<NailArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const loadArtists = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await artistAPI.adminFilter(filters);
      setArtists(data);
    } catch (err) {
      setError("Failed to load artists");
      console.error("Error loading artists:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArtists();
    setPage(1); // Reset to page 1 when filters change
  }, [filters]);

  const handleArtistUpdated = () => {
    loadArtists(); // Refresh the list
    onArtistsUpdated?.();
  };

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
            onClick={loadArtists}
            className="ml-4"
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (artists.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground" />
        <div>
          <h3 className="text-lg font-medium">No artists found</h3>
          <p className="text-muted-foreground mt-1">
            {Object.keys(filters).length > 0
              ? "Try adjusting your filters"
              : "No artists registered yet"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <PaginationWrapper
      items={artists}
      currentPage={page}
      pageSize={9}
      onPageChange={setPage}
      renderItem={(artist) => (
        <ArtistCard
          key={artist.id}
          artist={artist}
          onViewDetails={() => onArtistSelect(artist.id)}
          onArtistUpdated={handleArtistUpdated}
        />
      )}
      gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    />
  );
};

export default ArtistList;
