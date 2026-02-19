import { MapPin, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { artistAPI, LocationAPI, shopAPI } from "@/services/api";

export const LocationInfo = ({ shopLocation, nailArtist, booking }: any) => {
  const { data: artist, isLoading: artistLoading } = useQuery({
    queryKey: ["artist", booking.nailArtistId],
    queryFn: () => artistAPI.getById(booking.nailArtistId),
    enabled: !!booking.nailArtistId,
  });

  const { data: shop, isLoading: shopLoading } = useQuery({
    queryKey: ["shop", booking.shopLocationId],
    queryFn: () => LocationAPI.getById(booking.shopLocationId),
    enabled: !!booking.shopLocationId,
  });

  return (
    <Card className="border-none shadow-sm rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
          <MapPin className="w-4 h-4 text-[#88D0F9]" />
          {booking?.shopLocationId ? "Shop" : "Artist"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {booking?.shopLocationId && shop ? (
          <>
            <p className="font-black text-slate-900 uppercase tracking-tighter text-lg">
              {shop.shopName}
            </p>
            <p className="text-sm font-bold text-slate-400 mt-1">
              {shop.address}
            </p>
            <p className="text-sm font-bold text-slate-400 mt-1">
              {shop.phone}
            </p>
            <p className="text-sm font-bold text-[#88D0F9] mt-1">
              {shop.openingTime} – {shop.closingTime}
            </p>
          </>
        ) : artist ? (
          <>
            <p className="font-black text-slate-900 uppercase tracking-tighter text-lg">
              {artist.fullName}
            </p>
            <p className="text-sm font-bold text-slate-400 mt-1">
              {artist.phone ?? "No phone available"}
            </p>
            <p className="text-sm font-bold text-slate-400 mt-1">
              {artist.address}
            </p>
          </>
        ) : (
          <p className="text-xs font-bold text-slate-300 uppercase animate-pulse">
            Loading details...
          </p>
        )}
      </CardContent>
    </Card>
  );
};
