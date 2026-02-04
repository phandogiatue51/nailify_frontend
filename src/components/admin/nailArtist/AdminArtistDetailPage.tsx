"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArtistDetailView } from "@/components/admin/nailArtist/ArtistDetailView";

const AdminArtistDetailPage = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuthContext();

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

  if (!artistId) {
    return <Navigate to="/admin/artists" replace />;
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/artists")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Artists
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <ArtistDetailView
            artistId={artistId}
            onArtistUpdated={() => {
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminArtistDetailPage;
