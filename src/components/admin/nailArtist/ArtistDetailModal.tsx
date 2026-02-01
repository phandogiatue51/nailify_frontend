import { useState, useEffect } from "react";
import { NailArtist } from "@/types/database";
import { artistAPI } from "@/services/api";
import { CollectionPreview } from "../CollectionPreview";
import { ServicePreview } from "../ServicePreview";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  XCircle,
  Star,
  Mail,
  Phone,
  Calendar,
  User,
  MapPin,
  Award,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";

interface ArtistDetailModalProps {
  artistId: string | null;
  open: boolean;
  onClose: () => void;
  onArtistUpdated?: () => void;
}

export const ArtistDetailModal = ({
  artistId,
  open,
  onClose,
  onArtistUpdated,
}: ArtistDetailModalProps) => {
  const [artist, setArtist] = useState<NailArtist | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const loadArtistDetails = async () => {
    if (!artistId) return;

    setLoading(true);
    try {
      const artists = await artistAPI.getById(artistId);
      setArtist(artists || null);
    } catch (error) {
      console.error("Error loading artist details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && artistId) {
      loadArtistDetails();
    } else {
      setArtist(null);
    }
  }, [open, artistId]);

  const handleVerify = async () => {
    if (!artistId) return;

    setVerifying(true);
    try {
      await artistAPI.verifyArtist(artistId);
      onArtistUpdated?.();
      loadArtistDetails();
    } catch (error) {
      console.error("Failed to verify artist:", error);
    } finally {
      setVerifying(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch {
      return dateString;
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !artist ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Artist not found</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {artist.avatarUrl && (
                    <img
                      src={artist.avatarUrl}
                      alt={artist.fullName}
                      className="w-16 h-16 rounded-full object-cover border"
                    />
                  )}
                  <div>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                      {artist.fullName}
                      {artist.isVerified && (
                        <Badge className="ml-2">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified Pro
                        </Badge>
                      )}
                    </DialogTitle>
                    <DialogDescription>
                      Artist ID: {artist.id}
                    </DialogDescription>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!artist.isVerified && (
                    <Button
                      onClick={handleVerify}
                      disabled={verifying}
                      size="sm"
                    >
                      {verifying ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Verify Artist
                    </Button>
                  )}
                  <Button variant="destructive" size="sm">
                    <XCircle className="w-4 h-4 mr-2" />
                    Disable
                  </Button>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* Profile Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Contact Information</h4>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">
                          {artist.email}
                        </p>
                      </div>
                    </div>

                    {artist.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Phone</p>
                          <p className="text-sm text-muted-foreground">
                            {artist.phone}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Profile Details</h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-muted-foreground" />
                        <span>Status</span>
                      </div>
                      <Badge
                        variant={artist.isVerified ? "default" : "secondary"}
                      >
                        {artist.isVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>Joined: {formatDate(artist.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Artist Rating</h4>
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  <div>
                    <span className="text-2xl font-bold">
                      {artist.rating?.toFixed(1) || "0.0"}
                    </span>
                    <span className="text-muted-foreground ml-2">/ 5.0</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <ServicePreview
                  artistId={artist.id}
                  compact
                  title="Artist Services"
                />
                <CollectionPreview
                  artistId={artist.id}
                  compact
                  title="Artist Collections"
                />
              </div>

              {/* Stats */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Artist Stats</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-xs text-muted-foreground">
                      Total Services
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-xs text-muted-foreground">
                      Total Bookings
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-xs text-muted-foreground">
                      Collections
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-xs text-muted-foreground">Reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ArtistDetailModal;
