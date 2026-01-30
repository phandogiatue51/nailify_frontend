// components/explore/NailArtistCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, User } from "lucide-react";
import { NailArtist } from "@/types/database";
import { Link } from "react-router-dom";

interface NailArtistCardProps {
  artist: NailArtist;
}

const NailArtistCard: React.FC<NailArtistCardProps> = ({ artist }) => {
  const hasRating = artist.rating !== undefined && artist.rating !== null;
  const hasServices = artist.serviceItems && artist.serviceItems.length > 0;

  return (
    <Link to={`/artist/${artist.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="p-0">
          {/* Artist Image/Profile */}
          <div className="relative aspect-square overflow-hidden">
            {artist.profile?.avatarUrl ? (
              <img
                src={artist.profile.avatarUrl}
                alt={artist.profile.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <User className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="p-3 space-y-2">
            {/* Name and Rating */}
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-sm line-clamp-1">
                {artist.profile?.fullName || "Nail Artist"}
              </h3>
              {hasRating && (
                <div className="flex items-center gap-1 text-xs">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{artist.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* Address */}
            {artist.address && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span className="line-clamp-1">{artist.address}</span>
              </p>
            )}

            {/* Services Count */}
            <div className="flex items-center justify-between pt-1">
              {hasServices ? (
                <Badge variant="secondary" className="text-xs">
                  {artist.serviceItems!.length} services
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  No services yet
                </Badge>
              )}

              {artist.isVerified && (
                <Badge variant="default" className="text-xs bg-green-500">
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default NailArtistCard;
