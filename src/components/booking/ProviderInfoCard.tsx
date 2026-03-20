import { Flower, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProviderInfoCardProps {
    isArtistBooking: boolean;
    artist?: {
        fullName?: string;
        phone?: string;
    };
    locationObj?: {
        shopName?: string;
        address?: string;
        city?: string;
        openingTime?: string;
        closingTime?: string;
    };
}

export const ProviderInfoCard = ({
    isArtistBooking,
    artist,
    locationObj,
}: ProviderInfoCardProps) => {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                    {isArtistBooking ? (
                        <Flower className="w-5 h-5 text-primary" />
                    ) : (
                        <MapPin className="w-5 h-5 text-primary" />
                    )}
                    <h2 className="text-md font-black uppercase tracking-tight">
                        {isArtistBooking ? "Thông tin thợ Nail" : "Thông tin cửa hàng"}
                    </h2>
                </div>

                {isArtistBooking ? (
                    <div>
                        <p className="font-black text-slate-900 uppercase tracking-tighter text-lg">
                            {artist?.fullName}
                        </p>
                        <p className="text-sm font-bold text-slate-400 mt-1">
                            {artist?.phone ?? "Không có số điện thoại"}
                        </p>
                    </div>
                ) : locationObj ? (
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase">
                                {locationObj.shopName}
                            </h2>
                            <p className="text-md font-bold text-slate-500 mt-2">
                                {locationObj.address}, {locationObj.city}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2">
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                                <p className="text-sm font-black uppercase text-slate-400 mb-1">
                                    Mở cửa
                                </p>
                                <p className="text-sm font-bold text-slate-700">
                                    {locationObj.openingTime}
                                </p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                                <p className="text-sm font-black uppercase text-slate-400 mb-1">
                                    Đóng cửa
                                </p>
                                <p className="text-sm font-bold text-slate-700">
                                    {locationObj.closingTime}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
};