import { useState } from "react";
import { ServiceItem } from "@/types/database";
import { serviceItemAPI } from "@/services/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Package,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface ServicePreviewProps {
  shopId?: string;
  artistId?: string;
  compact?: boolean;
  title?: string;
}

export const ServicePreview = ({
  shopId,
  artistId,
  compact = false,
  title = "Các dịch vụ",
}: ServicePreviewProps) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const loadServices = async () => {
    if (services.length > 0) return;

    setLoading(true);
    try {
      const filterParams: any = {};

      if (shopId) filterParams.ShopId = shopId;
      if (artistId) filterParams.NailArtistId = artistId;

      const data = await serviceItemAPI.adminFilter(filterParams);
      setServices(data);
    } catch (error) {
      console.error("Error loading services:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = () => {
    if (!expanded && services.length === 0) {
      loadServices();
    }
    setExpanded(!expanded);
  };

  // Compact view (for cards)
  if (compact) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={toggleExpand}
          className="w-full justify-between hover:bg-slate-50 rounded-2xl p-6 h-auto border border-slate-100"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-slate-900 rounded-xl text-white">
              <Package className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#950101] leading-none mb-1">
                Dossier
              </p>
              <span className="font-black uppercase text-sm tracking-tight text-slate-900">
                {title} ({services.length})
              </span>
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-slate-300" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-300" />
          )}
        </Button>

        {expanded && (
          <div className="pl-4 space-y-3 animate-in slide-in-from-top-2 duration-300">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto text-slate-300" />
            ) : services.length > 0 ? (
              services.slice(0, 3).map((service) => (
                <div
                  key={service.id}
                  className="flex justify-between items-center bg-white p-3 rounded-2xl border border-slate-50 shadow-sm"
                >
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-tight truncate pr-4">
                    {service.name}
                  </span>
                  <Badge
                    className={`text-[9px] font-black uppercase tracking-widest ${service.isActive ? "bg-emerald-500" : "bg-slate-200 text-slate-500"}`}
                  >
                    {service.isActive ? "Live" : "Off"}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-[10px] font-bold text-slate-400 uppercase italic pl-4">
                Empty Portfolio
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  // Full view (for modal/detail page)
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end px-2">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#950101] mb-2">
            Catalogue
          </h3>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 flex items-center gap-3">
            {title} <span className="text-slate-300">/</span> {services.length}
          </h2>
        </div>
        <Button
          variant="link"
          className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#950101]"
          onClick={toggleExpand}
        >
          {expanded ? "Thu gọn" : "Xem tất cả"}
        </Button>
      </div>

      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-500">
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#950101]" />
            </div>
          ) : services.length > 0 ? (
            services.map((service) => (
              <Card
                key={service.id}
                className="overflow-hidden rounded-[2rem] border-2 border-slate-50 shadow-none hover:border-[#950101]/20 transition-all group"
              >
                <div className="flex h-32">
                  <div className="flex-1 p-5 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-black uppercase text-sm tracking-tight text-slate-900 group-hover:text-[#950101] transition-colors line-clamp-1">
                        {service.name}
                      </h4>
                      <Badge
                        variant="outline"
                        className="text-[8px] font-black uppercase border-slate-200"
                      >
                        {service.isActive ? "Active" : "Hidden"}
                      </Badge>
                    </div>

                    <p className="text-[11px] text-slate-400 font-medium italic line-clamp-2 leading-tight">
                      {service.description ||
                        "No description provided for this service."}
                    </p>

                    <div className="flex items-center gap-4 pt-1">
                      <div className="flex items-center gap-1 text-[#950101]">
                        <span className="text-[10px] font-black uppercase">
                          đ
                        </span>
                        <span className="text-sm font-black italic">
                          {Number(service.price).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span className="text-[10px] font-bold">
                          {service.estimatedDuration} {" phút"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Fixed Image/Color section with no text fallback */}
                  <div className="w-32 bg-slate-100 relative">
                    {service.imageUrl ? (
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#950101] to-[#FFCFE9] opacity-60" />
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full p-12 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic">
                No services listed
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
