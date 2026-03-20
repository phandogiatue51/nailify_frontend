import { User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CustomerInfoCardProps {
    isCustomer?: boolean;
    profile?: {
        fullName?: string;
        phone?: string;
        address?: string;
    };
    customerName?: string;
    customerPhone?: string;
    customerAddress?: string;
}

export const CustomerInfoCard = ({
    isCustomer = false,
    profile,
    customerName,
    customerPhone,
    customerAddress,
}: CustomerInfoCardProps) => {
    const displayName = profile?.fullName || customerName;
    const displayPhone = profile?.phone || customerPhone;
    const displayAddress = profile?.address || customerAddress;

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-primary" />
                    <h2 className="text-md font-black uppercase tracking-tight">
                        {isCustomer ? "Thông tin của bạn" : "Thông tin khách hàng"}
                    </h2>
                </div>

                <div>
                    {displayName && (
                        <p className="font-black text-slate-900 uppercase tracking-tighter text-lg">
                            {displayName}
                        </p>
                    )}
                    {displayPhone && (
                        <p className="text-sm font-bold text-slate-400 mt-1">
                            {displayPhone}
                        </p>
                    )}
                    {displayAddress && (
                        <p className="text-sm font-bold text-slate-400 mt-1">
                            {displayAddress}
                        </p>
                    )}
                    {!displayName && !displayPhone && !displayAddress && (
                        <p className="text-sm text-slate-400 italic">
                            Chưa có thông tin khách hàng
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};