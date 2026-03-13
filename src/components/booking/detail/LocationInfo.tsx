import { Loader2, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { artistAPI, LocationAPI } from "@/services/api";

export const LocationInfo = ({ booking }: any) => {
  const { data: artist } = useQuery({
    queryKey: ["artist", booking.nailArtistId],
    queryFn: () => artistAPI.getById(booking.nailArtistId),
    enabled: !!booking.nailArtistId,
  });

  const { data: shop } = useQuery({
    queryKey: ["shop", booking.shopLocationId],
    queryFn: () => LocationAPI.getById(booking.shopLocationId),
    enabled: !!booking.shopLocationId,
  });

  return (
    <Card className="border-none shadow-sm rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
          <MapPin className="w-4 h-4 text-[#88D0F9]" />
          {booking?.shopLocationId ? "Cửa hàng" : "Thợ Nail"}
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
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
