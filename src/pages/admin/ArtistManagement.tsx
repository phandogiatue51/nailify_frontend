import { useState } from "react";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import ArtistFilter from "@/components/admin/nailArtist/ArtistFilter";
import { ArtistFilterDto } from "@/types/filter";
import ArtistList from "@/components/admin/nailArtist/ArtistList";
import { useNavigate } from "react-router-dom";
const ArtistsManagement = () => {
  const { user, loading } = useAuthContext();
  const [filters, setFilters] = useState<ArtistFilterDto>({});
  const navigate = useNavigate();

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
  const handleArtistSelect = (artistId: string) => {
    navigate(`/admin/artists/${artistId}`);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý thợ nail</h1>
          <p className="text-muted-foreground">
            Quản lý và xác minh thợ nail
          </p>
        </div>
        <div className="text-sm text-muted-foreground">Nailify Dashboard</div>
      </div>

      <ArtistFilter filters={filters} onFilterChange={setFilters} />

      <div className="mt-6">
        <ArtistList filters={filters} onArtistSelect={handleArtistSelect} />
      </div>
    </div>
  );
};

export default ArtistsManagement;
