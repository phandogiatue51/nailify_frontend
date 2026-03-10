import { NailArtist } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Eye, Star, Mail, Phone, Calendar } from "lucide-react";
import DateDisplay from "@/components/ui/date-display";

interface ArtistCardProps {
  artist: NailArtist;
  onViewDetails: () => void;
  onArtistUpdated?: () => void;
}

export const ArtistCard = ({ artist, onViewDetails }: ArtistCardProps) => {
  return (
    <Card className="group relative overflow-hidden border-2 border-slate-100 rounded-[2.5rem] transition-all duration-500 hover:border-[#950101] hover:shadow-2xl hover:shadow-[#950101]/10 bg-white">
      <CardContent className="p-6">
        {/* Artist Header / Avatar */}
        <div className="flex justify-center items-start mb-6">
          <div className="relative">
            {artist.avatarUrl ? (
              <img
                src={artist.avatarUrl}
                alt={artist.fullName}
                className="w-16 h-16 rounded-3xl object-cover border-2 border-white shadow-md group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-16 h-16 rounded-3xl border-2 border-white shadow-md flex items-center justify-center bg-gradient-to-br from-[#950101] to-[#6b0101]">
                <span className="text-2xl font-black text-white uppercase italic">
                  {artist.fullName?.[0] || "A"}
                </span>
              </div>
            )}

            {/* Rating Badge Overlay */}
            <div className="absolute -bottom-2 -right-2 bg-white px-2 py-1 rounded-xl shadow-sm border border-slate-100 flex items-center gap-1 scale-90 group-hover:scale-100 transition-transform">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[10px] font-black">
                {artist.rating?.toFixed(1) || "0.0"}
              </span>
            </div>
          </div>
        </div>

        {/* Identity Section */}
        <div className="mb-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none group-hover:text-[#950101] transition-colors">
              {artist.fullName}
            </h3>
            {artist.artistVerified && (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />
            )}
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap justify-center gap-2">
          <Badge
            className={`border-none px-3 font-black text-[9px] uppercase tracking-widest ${
              artist.artistVerified
                ? "bg-emerald-50 text-emerald-600"
                : "bg-amber-50 text-amber-600"
            }`}
          >
            {artist.artistVerified ? "Đã xác minh" : "Chưa xác minh"}
          </Badge>
        </div>

        {/* Contact Info Section */}
        <div className="space-y-2 pt-4 border-t border-slate-50">
          <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
            <Mail className="w-4 h-4 text-[#950101]/40" />
            <span className="truncate">{artist.email || "N/A"}</span>
          </div>
          {artist.phone && (
            <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
              <Phone className="w-4 h-4 text-[#950101]/40" />
              <span>{artist.phone}</span>
            </div>
          )}
        </div>

        {/* Meta Info */}
        <div className="space-y-4 pt-4 border-t border-slate-50">
          <div className="flex items-center gap-2 text-[12px] font-bold uppercase text-slate-500">
            <span>Ngày gia nhập: </span>
            <DateDisplay dateString={artist.createdAt} showTime={false} />
          </div>
        </div>

        {/* Main Action */}
        <div className="pt-6">
          <Button
            variant="ghost"
            className="w-full rounded-2xl font-black uppercase tracking-widest text-[10px] h-11 text-[#950101] hover:text-[#950101] hover:bg-red-50 transition-all border border-transparent hover:border-red-100 shadow-md"
            onClick={onViewDetails}
          >
            <Eye className="w-4 h-4 mr-2" />
            Xem chi tiết
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArtistCard;
