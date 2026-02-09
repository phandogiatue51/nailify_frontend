import { NailArtist } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  Eye,
  Star,
  Mail,
  Phone,
  Calendar,
  MoreVertical,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CollectionPreview } from "../CollectionPreview";
import { ServicePreview } from "../ServicePreview";
import DateDisplay from "@/components/ui/date-display";
interface ArtistCardProps {
  artist: NailArtist;
  onViewDetails: () => void;
  onArtistUpdated?: () => void;
}

export const ArtistCard = ({ artist, onViewDetails }: ArtistCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-3">
            {artist.avatarUrl && (
              <img
                src={artist.avatarUrl}
                alt={artist.fullName}
                className="w-12 h-12 rounded-full object-cover border"
              />
            )}
            <div>
              <h3 className="font-semibold text-lg">{artist.fullName}</h3>
              <div className="flex items-center gap-2 mt-1">
                {artist.email && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    <span className="truncate max-w-[150px]">
                      {artist.email}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status & Rating */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant={artist.artistVerified ? "default" : "secondary"}>
            {artist.artistVerified ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </>
            ) : (
              "Unverified"
            )}
          </Badge>

          <Badge variant="outline" className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{artist.rating?.toFixed(1) || "N/A"}</span>
          </Badge>

          {artist.phone && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {artist.phone}
            </Badge>
          )}
        </div>

        {/* Basic Info */}
        <div className="grid gap-2 mb-4 text-sm">
          <DateDisplay
            dateString={artist.createdAt}
            label="Created At"
            showTime
          />
        </div>

        {/* Service & Collection Previews */}
        <div className="space-y-3 pt-4 border-t">
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
      </CardContent>

      <div className="bg-muted/30 p-4">
        <Button variant="outline" className="w-full" onClick={onViewDetails}>
          <Eye className="w-4 h-4 mr-2" />
          View Full Details
        </Button>
      </div>
    </Card>
  );
};

export default ArtistCard;
