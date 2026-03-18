import { useState, useEffect } from "react";
import { ServiceItem } from "@/types/database";
import { serviceItemAPI } from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { ComponentBadge } from "@/components/badge/ComponentBadge";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Clock,
  Calendar,
  Building,
  User,
  Layers,
  Loader2,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface ServiceDetailModalProps {
  serviceId: string | null;
  open: boolean;
  onClose: () => void;
  onServiceUpdated?: () => void;
}

export const ServiceDetailModal = ({
  serviceId,
  open,
  onClose,
  onServiceUpdated,
}: ServiceDetailModalProps) => {
  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadServiceDetails = async () => {
    if (!serviceId) return;

    setLoading(true);
    try {
      // Use getById endpoint instead of filtering!
      const data = await serviceItemAPI.getById(serviceId);
      setService(data);
    } catch (error) {
      console.error("Error loading service details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && serviceId) {
      loadServiceDetails();
    } else {
      setService(null);
    }
  }, [open, serviceId]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP 'at' p");
    } catch {
      return dateString;
    }
  };

  const handleViewShop = () => {
    if (service?.shopId) {
      navigate(`/admin/shops/${service.shopId}`);
      onClose();
    }
  };

  const handleViewArtist = () => {
    if (service?.nailArtistId) {
      navigate(`/admin/artists/${service.nailArtistId}`);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-none !rounded-3xl bg-white shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>Details</DialogTitle>
        </VisuallyHidden>

        <VisuallyHidden>
          <DialogDescription>Information</DialogDescription>
        </VisuallyHidden>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#950101]" />
          </div>
        ) : !service ? (
          <div className="text-center py-24 px-12">
            <AlertCircle className="w-12 h-12 mx-auto text-slate-200 mb-6" />
            <p className="text-xl font-black text-slate-900 uppercase italic">
              Service not found
            </p>
          </div>
        ) : (
          <div className="flex flex-col max-h-[90vh] overflow-y-auto outline-none">
            {/* HERO SECTION */}
            <div className="relative h-48 w-full group">
              {service.imageUrl ? (
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-48 object-cover transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-[#950101] to-[#FFCFE9] flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-white/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">
                      {service.name}
                    </h2>
                    <Badge className="bg-white text-black hover:bg-white text-[10px] font-black px-3 py-0.5 rounded-full border-none">
                      {service.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                    </Badge>
                  </div>
                  <p className="text-[10px] font-bold text-white/50 tracking-[0.3em] uppercase">
                    Id: {service.id.slice(0, 12)}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-10">
              {/* PRICING & DURATION DASHBOARD */}
              <div className="grid grid-cols-2 gap-8 border-b-2 border-slate-50">
                <div>
                  <p className="text-[10px] font-black text-[#950101] uppercase tracking-[0.3em]">
                    Giá tiền
                  </p>
                  <p className="text-4xl font-black italic tracking-tighter text-slate-900">
                    {Number(service.price).toLocaleString()}{" "}
                    <span className="text-lg not-italic text-slate-400">đ</span>
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    Thời gian dự kiến
                  </p>
                  <div className="flex items-center justify-end gap-2 text-4xl font-black italic tracking-tighter text-slate-900">
                    <Clock className="w-6 h-6 text-[#950101] not-italic" />
                    <span>
                      {service.estimatedDuration}{" "}
                      <span className="text-lg not-italic text-slate-400">
                        phút
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* DESCRIPTION SECTION */}
              <section className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 flex items-center gap-3">
                  <div className="w-8 h-[1px] bg-slate-200" /> Mô tả
                </h4>
                <p className="text-lg text-slate-600 font-medium leading-relaxed italic border-l-4 border-[#950101]/10 pl-6">
                  {service.description ||
                    "No specific details provided for this treatment."}
                </p>
              </section>

              {/* SPECS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                {/* Left Column: Classification */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                    Thông tin cơ bản
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                      <div className="flex items-center gap-3">
                        <Layers className="w-4 h-4 text-[#950101]" />
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                          Loại dịch vụ
                        </span>
                      </div>
                      <ComponentBadge role={service.componentType} />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-[#950101]" />
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                          Ngày tạo
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-900 italic uppercase">
                        {formatDate(service.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Origin */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                    Phát hành bởi
                  </h4>
                  <div className="space-y-3">
                    {service.shopId ? (
                      <div
                        onClick={handleViewShop}
                        className="group flex items-center justify-between p-4 bg-white border-2 border-slate-50 rounded-2xl hover:border-[#950101] transition-all cursor-pointer shadow-sm"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-[#950101]/5 transition-colors">
                            <Building className="w-5 h-5 text-[#950101]" />
                          </div>
                          <div>
                            <p className="text-[12px] font-black text-slate-400 uppercase leading-none mb-1">
                              Bộ sưu tập cửa hàng
                            </p>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-[#950101]" />
                      </div>
                    ) : service.nailArtistId ? (
                      <div
                        onClick={handleViewArtist}
                        className="group flex items-center justify-between p-4 bg-white border-2 border-slate-50 rounded-2xl hover:border-[#950101] transition-all cursor-pointer shadow-sm"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-[#950101]/5 transition-colors">
                            <User className="w-5 h-5 text-[#950101]" />
                          </div>
                          <div>
                            <p className="text-[12px] font-black text-slate-400 uppercase leading-none mb-1">
                              Tác phẩm thợ nail
                            </p>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-[#950101]" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 p-4 bg-slate-100 rounded-2xl border border-dashed border-slate-200">
                        <Package className="w-5 h-5 text-slate-400" />
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-tight">
                          Chung
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDetailModal;
