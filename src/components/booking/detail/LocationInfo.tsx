import { MapPin, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const LocationInfo = ({ shopLocation, nailArtist, booking }: any) => {
  return (
    <div className="space-y-4">
      {/* Location Card */}
      <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
            <MapPin className="w-4 h-4 text-[#88D0F9]" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          {booking?.shopLocationId ? (
            shopLocation ? (
              <div className="space-y-2">
                <h2 className="font-black text-slate-900 text-md tracking-tight uppercase">
                  Shop: {shopLocation.shopName}
                </h2>
                <div className="text-sm text-slate-500 space-y-1">
                  <p className="font-medium">{shopLocation.address}</p>
                  <p className="font-black text-[#88D0F9] uppercase tracking-tight">
                    {shopLocation.openingTime} - {shopLocation.closingTime}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs font-bold text-slate-300 uppercase animate-pulse">
                Loading location details...
              </p>
            )
          ) : (
            <div className="space-y-2">
              <h2 className="font-black text-slate-900 text-md tracking-tight uppercase">
                Artist: {booking.nailArtistName}
              </h2>
              <div className="text-sm text-slate-500 space-y-1">
                <p className="font-medium">{booking.address}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rating Card */}
      <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
        <CardHeader className="pb-2">
          {/* justify-between pushes the stars to the far right */}
          <CardTitle className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
              <Star className="w-4 h-4 text-[#FFC988]" />
              Rating
            </div>

            {/* Star visualization on the right */}
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-3.5 h-3.5",
                    i < (booking?.ratings || 0)
                      ? "text-[#FFC988] fill-[#FFC988]"
                      : "text-slate-100 fill-slate-50",
                  )}
                />
              ))}
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {booking?.ratings ? (
            <div>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-black tracking-tighter text-slate-900">
                  {booking.ratings.toFixed(1)}
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  out of 5
                </span>
              </div>

              {booking.comment && (
                <div className="relative">
                  <span className="absolute -top-4 -left-1 text-6xl text-pink-400 font-serif opacity-70 pointer-events-none select-none">
                    “
                  </span>

                  <p className="relative text-sm font-bold text-slate-600 leading-relaxed px-6 italic text-center">
                    {booking.comment}
                  </p>

                  <span className="absolute -bottom-6 -right-1 text-6xl text-pink-400 font-serif opacity-70 pointer-events-none select-none rotate-180 inline-block mb-4">
                    “
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="py-4 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-50 rounded-3xl">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                Pending Client Review
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
