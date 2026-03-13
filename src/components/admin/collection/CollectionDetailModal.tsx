import { useState, useEffect } from "react";
import { Collection } from "@/types/database";
import { collectionAPI } from "@/services/api";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Layers,
  Building,
  User,
  Loader2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Package,
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
interface CollectionDetailModalProps {
  collectionId: string | null;
  open: boolean;
  onClose: () => void;
}

export const CollectionDetailModal = ({
  collectionId,
  open,
  onClose,
}: CollectionDetailModalProps) => {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const loadCollectionDetails = async () => {
    if (!collectionId) return;

    setLoading(true);
    try {
      // Use getById endpoint
      const data = await collectionAPI.getById(collectionId);
      setCollection(data);
    } catch (error) {
      console.error("Error loading collection details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && collectionId) {
      loadCollectionDetails();
    } else {
      setCollection(null);
    }
  }, [open, collectionId]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP 'at' p");
    } catch {
      return dateString;
    }
  };

  const handleViewShop = () => {
    if (collection?.shopId) {
      navigate(`/admin/shops/${collection.shopId}`);
      onClose();
    }
  };

  const handleViewArtist = () => {
    if (collection?.nailArtistId) {
      navigate(`/admin/artists/${collection.nailArtistId}`);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden border-none !rounded-3xl bg-white shadow-2xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#950101]" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
              Assembling Collection
            </p>
          </div>
        ) : !collection ? (
          <div className="text-center py-24 px-12">
            <AlertCircle className="w-12 h-12 mx-auto text-slate-200 mb-6" />
            <p className="text-xl font-black text-slate-900 uppercase italic">
              Collection not found
            </p>
          </div>
        ) : (
          <div className="flex flex-col max-h-[90vh] overflow-y-auto outline-none">
            {/* LOOKBOOK HERO */}
            <div className="relative h-48 w-full group">
              {collection.imageUrl ? (
                <img
                  src={collection.imageUrl}
                  alt={collection.name}
                  className="w-full h-48 object-cover transition-transform duration-1000"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-[#950101] to-[#FFCFE9] flex items-center justify-center"></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />

              <div className="absolute bottom-10 left-10 right-10 flex items-end justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-4xl font-black text-white uppercase leading-none">
                      {collection.name}
                    </h2>
                    <div
                      className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border ${
                        collection.isActive
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      }`}
                    >
                      {collection.isActive
                        ? "Đang hoạt động"
                        : "Ngừng hoạt động"}
                    </div>
                  </div>
                  <p className="text-[11px] font-bold text-white/40 tracking-[0.5em] uppercase">
                    ID — {collection.id.slice(0, 14)}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-10 space-y-4">
              {/* VALUE & TIME DASHBOARD */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-slate-50 rounded-[2.5rem]">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-[#950101] uppercase tracking-[0.3em]">
                    Tổng giá tiền
                  </p>
                  <p className="text-3xl font-black italic text-slate-900">
                    {collection.totalPrice?.toLocaleString() ?? 0}{" "}
                    <span className="text-sm not-italic text-slate-400">
                      đ
                    </span>
                  </p>
                </div>
                <div className="space-y-1 border-l-2 border-slate-200 pl-8">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    Thời gian dự kiến
                  </p>
                  <p className="text-3xl font-black italic text-slate-900">
                    {collection.estimatedDuration != null
                      ? collection.estimatedDuration
                      : collection.calculatedDuration}
                    <span className="text-sm not-italic text-slate-400">
                      {" phút"}
                    </span>
                  </p>
                </div>
                <div className="space-y-1 border-l-2 border-slate-200 pl-8">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    Dịch vụ bao gồm
                  </p>
                  <p className="text-3xl font-black italic text-slate-900">
                    {collection.items?.length ?? 0}{" "}
                    <span className="text-sm not-italic text-slate-400">
                      dịch vụ
                    </span>
                  </p>
                </div>
              </div>

              {/* CURATOR NOTES (Description) */}
              {collection.description && (
                <section className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 flex items-center gap-3">
                    <div className="w-8 h-[1px] bg-slate-200" /> Mô tả
                  </h4>
                  <p className="text-lg text-slate-600 font-medium leading-relaxed italic border-l-4 border-[#950101]/10 pl-6 max-w-2xl">
                    "{collection.description}"
                  </p>
                </section>
              )}

              {/* SERVICE ITEMS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* LEFT COLUMN: SERVICES (Takes 2/3 space) */}
                <section className="md:col-span-2 space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                    Bao gồm dịch vụ
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {collection.items?.map((item: any) => (
                      <div
                        key={item.id}
                        className="group flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-2xl hover:border-[#950101] transition-all shadow-sm"
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                          {item.serviceItemImageUrl ? (
                            <img
                              src={item.serviceItemImageUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                              <Sparkles className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-black uppercase text-slate-900 truncate">
                            {item.serviceItemName}
                          </p>
                          <p className="text-[10px] font-bold text-[#950101] italic">
                            {item.serviceItemPrice?.toLocaleString()} đ
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* RIGHT COLUMN: METADATA & TAGS (Takes 1/3 space) */}
                <aside className="space-y-8 border-l border-slate-100 pl-0 md:pl-8">
                  {/* Provider Card */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                      Phát hành
                    </h4>
                    {collection.shopId ? (
                      <div
                        onClick={handleViewShop}
                        className="group p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-[#950101] transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Building className="w-4 h-4 text-[#950101]" />
                          <span className="text-[11px] font-black uppercase text-slate-900">
                            Bộ sưu tập Cửa hàng
                          </span>
                        </div>
                      </div>
                    ) : collection.nailArtistId ? (
                      <div
                        onClick={handleViewArtist}
                        className="group p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-[#950101] transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <User className="w-4 h-4 text-[#950101]" />
                          <span className="text-[11px] font-black uppercase text-slate-900">
                            Tác phẩm Thợ Nail
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-100/50 rounded-2xl border border-dashed border-slate-200 flex items-center gap-3">
                        <Package className="w-4 h-4 text-slate-400" />
                        <span className="text-[11px] font-black uppercase text-slate-400">
                          Hệ thống
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Timeline Info */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400 font-bold uppercase">
                          Ngày tạo:
                        </span>
                        <span className="text-slate-900 font-black italic">
                          {formatDate(collection.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Compact Tags */}
                  {collection.tags && collection.tags.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1.5">
                        {collection.tags.map((tag: any) => (
                          <span
                            key={tag.id}
                            className="px-3 py-1 bg-white border border-slate-100 text-[9px] font-black uppercase text-slate-500 rounded-lg hover:text-[#950101] transition-colors"
                          >
                            #{tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </aside>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CollectionDetailModal;
