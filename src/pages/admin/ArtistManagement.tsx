import { useState } from "react";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import ArtistFilter from "@/components/admin/nailArtist/ArtistFilter";
import { ArtistFilterDto } from "@/types/filter";
import ArtistList from "@/components/admin/nailArtist/ArtistList";

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
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
            Quản lý <span className="text-[#950101]">Thợ Nail</span>
          </h1>
          <p className="text-sm font-bold text-slate-400 italic mt-1">
            Quản lý và xác minh danh sách nghệ sĩ nail
          </p>
        </div>
      </div>

      <div className="mb-6">
        <ArtistFilter filters={filters} onFilterChange={setFilters} />
      </div>

      <div>
        <ArtistList filters={filters} onArtistSelect={handleArtistSelect} />
      </div>
    </div>
  );
};

export default ArtistsManagement;
