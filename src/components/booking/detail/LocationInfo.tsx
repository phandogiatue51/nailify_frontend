import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const LocationInfo = ({ shopLocation, nailArtist, booking }: any) => {
  return (
    <Card className="border-none shadow-sm rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
          <MapPin className="w-4 h-4 text-[#88D0F9]" />
          Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        {booking?.shopLocationId ? (
          shopLocation ? (
            <div className="space-y-2">
              <h2 className="font-bold text-slate-900">
                {shopLocation.shopName}
              </h2>
              <div className="text-xs text-slate-500 space-y-1">
                <p>{shopLocation.address}</p>
                <p className="font-semibold text-[#88D0F9]">
                  {shopLocation.openingTime} - {shopLocation.closingTime}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              Location details loading...
            </p>
          )
        ) : (
          <div className="space-y-1">
            <p className="font-bold text-slate-700">Mobile Service</p>
            <p className="text-xs text-slate-500">
              {booking?.address ?? "Artist will travel to your location"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
