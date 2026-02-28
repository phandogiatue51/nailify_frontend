import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, User } from "lucide-react";
import { NailArtist } from "@/types/database";
import { useNavigate } from "react-router-dom";

import { CircleCheckBig } from "lucide-react";
interface NailArtistCardProps {
  artist: NailArtist;
}

const NailArtistCard: React.FC<NailArtistCardProps> = ({ artist }) => {
  const hasRating = artist.rating !== undefined && artist.rating !== null;
  const navigate = useNavigate();

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg active:scale-[0.98] rounded-[2rem]"
      onClick={() => navigate(`/artist/${artist.id}`)}
    >
      <CardContent className="p-0">
        <div className="relative aspect-video overflow-hidden">
          {artist.avatarUrl ? (
            <img
              src={artist.avatarUrl}
              alt={artist.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#950101] to-[#FFCFE9] flex items-center justify-center">
              <span className="text-2xl font-bold text-white uppercase">
                {artist.fullName?.[0] || "U"}
              </span>
            </div>
          )}
        </div>

        <div className="p-5 space-y-2">
          {/* Name and Rating */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-lg">{artist.fullName}</h3>
            </div>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default NailArtistCard;
