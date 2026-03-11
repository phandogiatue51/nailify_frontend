import { ServiceItem } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  DollarSign,
  Clock,
  Building,
  User,
  Package,
} from "lucide-react";
import { ComponentBadge } from "@/components/badge/ComponentBadge";

interface ServiceCardProps {
  service: ServiceItem;
  onViewDetails: () => void;
  onServiceUpdated?: () => void;
}

export const ServiceCard = ({ service, onViewDetails }: ServiceCardProps) => {
  return (
    <Card className="group relative overflow-hidden border-2 border-slate-100 rounded-[2.5rem] transition-all duration-500 hover:border-[#950101] hover:shadow-2xl hover:shadow-[#950101]/10 bg-white flex flex-col h-full">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Service Visual Header */}
        <div className="relative mb-6">
          <div className="aspect-[16/10] overflow-hidden rounded-3xl border-2 border-white shadow-md bg-slate-50">
            {service.imageUrl ? (
              <img
                src={service.imageUrl}
                alt={service.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#950101] to-[#6b0101]">
                <span className="text-3xl font-black text-white uppercase italic">
                  {service.name?.[0] || "S"}
                </span>
              </div>
            )}
          </div>

          {/* Top Overlays */}
          <div className="absolute top-3 left-3">
            <ComponentBadge role={service.componentType} />
          </div>
          <div className="absolute top-3 right-3">
            <Badge
              className={`border-none px-3 py-1 font-black text-[9px] uppercase tracking-widest shadow-sm ${
                service.isActive
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-500 text-white"
              }`}
            >
              {service.isActive ? "Hoạt động" : "Tạm ngưng"}
            </Badge>
          </div>
        </div>

        {/* Identity & Description */}
        <div className="flex-1">
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-[#950101] transition-colors line-clamp-1">
              {service.name}
            </h3>
          </div>

          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest line-clamp-2 h-8 leading-relaxed">
            {service.description || "Dịch vụ chăm sóc sắc đẹp cao cấp"}
          </p>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-50 p-1.5 rounded-lg">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <span className="text-sm font-black text-slate-700 tracking-tight">
                {service.price?.toLocaleString()}{" "}
                <span className="text-[10px]">VND</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-blue-50 p-1.5 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <span className="text-sm font-black text-slate-700 tracking-tight">
                {service.estimatedDuration}{" "}
                <span className="text-[10px]">phút</span>
              </span>
            </div>
          </div>
        </div>

        {/* Footer: Ownership & Meta */}
        <div className="space-y-4 pt-4 border-t border-slate-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              {service.shopId ? (
                <Building className="w-3.5 h-3.5 text-[#950101]/40" />
              ) : service.nailArtistId ? (
                <User className="w-3.5 h-3.5 text-[#950101]/40" />
              ) : (
                <Package className="w-3.5 h-3.5 text-[#950101]/40" />
              )}
              <span>
                {service.shopId
                  ? "Bộ sưu tập cửa hàng"
                  : service.nailArtistId
                    ? "Tác phẩm nghệ sĩ"
                    : "Chung"}
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            className="w-full rounded-2xl font-black uppercase tracking-widest text-[10px] h-11 text-[#950101] hover:text-[#950101] hover:bg-red-50  border border-transparent hover:border-red-100 shadow-md"
            onClick={onViewDetails}
          >
            <Eye className="w-4 h-4 mr-2" />
            Chi tiết dịch vụ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
