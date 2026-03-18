import { useState, useEffect } from "react";
import { BookRateStats, Shop } from "@/types/database";
import { adminAPI, shopAPI } from "@/services/api";
import { ServicePreview } from "../ServicePreview";
import { CollectionPreview } from "../CollectionPreview";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  MapPin,
  Phone,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import { Profile } from "@/types/database";
import UserDetailModal from "../user/UserDetailModal";
import { useToast } from "@/hooks/use-toast";
interface ShopDetailViewProps {
  shopId: string;
  onShopUpdated?: () => void;
}
import { profileAPI } from "@/services/api";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
export const ShopDetailView = ({
  shopId,
  onShopUpdated,
}: ShopDetailViewProps) => {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [owner, setOwner] = useState<Profile | null>(null);
  const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null);
  const [shopStats, setShopStats] = useState<BookRateStats | null>(null);
  const { toast } = useToast();
  const loadShopDetails = async () => {
    if (!shopId) return;

    setLoading(true);
    try {
      const shopData = await shopAPI.getById(shopId);
      const shopStats = await adminAPI.getShopStats(shopId);
      setShopStats(shopStats || null);
      setShop(shopData || null);
    } catch (error) {
      console.error("Error loading shop details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shopId) {
      loadShopDetails();
    } else {
      setShop(null);
    }
  }, [shopId]);

  useEffect(() => {
    if (shop?.ownerId) {
      const fetchOwner = async () => {
        try {
          const ownerData = await profileAPI.getById(shop.ownerId);
          setOwner(ownerData);
        } catch (error) {
          console.error("Error fetching owner:", error);
        }
      };
      fetchOwner();
    }
  }, [shop?.ownerId]);

  const handleVerify = async () => {
    if (!shopId) return;

    setVerifying(true);
    try {
      var response = await shopAPI.verifyShop(shopId);
      onShopUpdated?.();
      toast({
        description: response.message,
        variant: "success",
        duration: 3000,
      });
      loadShopDetails();
    } catch (error) {
      console.error("Failed to verify shop:", error);
      toast({
        description: error?.message,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setVerifying(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch {
      return dateString;
    }
  };

  if (!shopId) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No shop selected</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Shop not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col animate-in fade-in duration-700">
      {/* HERO SECTION - Height adjusted to h-48 */}
      <div className="relative h-48 group overflow-hidden">
        {shop.coverUrl ? (
          <img
            src={shop.coverUrl}
            alt="Cover"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#950101] to-[#FFCFE9]" />
        )}

        {/* Overlay with Shop Identity & Verify Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                {shop.logoUrl ? (
                  <img
                    src={shop.logoUrl || "/placeholder-logo.png"}
                    className="w-20 h-20 rounded-2xl border-4 border-white shadow-2xl object-cover bg-white"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-2xl bg-gradient-to-br from-[#950101] to-[#FFCFE9] flex items-center justify-center">
                    <span className="text-4xl font-black text-white uppercase italic">
                      {shop.name?.[0]}
                    </span>
                  </div>
                )}

                {shop.isVerified && (
                  <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-lg border-2 border-white">
                    <CheckCircle className="w-3 h-3" />
                  </div>
                )}
              </div>
              <div className="space-y-0.5">
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
                  {shop.name}
                </h1>
                <p className="text-[10px] font-bold text-white/50 tracking-[0.2em] uppercase">
                  ID: {shop.id.slice(0, 12)}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {!shop.isVerified && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      disabled={verifying}
                      className="bg-white text-slate-900 hover:bg-[#950101] hover:text-white rounded-xl font-black uppercase tracking-widest text-[10px] px-6 h-10 transition-all shadow-xl"
                    >
                      {verifying ? (
                        <Loader2 className="w-3 h-3 animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="w-3 h-3 mr-2" />
                      )}
                      Kích hoạt cửa hàng
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent className="rounded-[2rem]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-black uppercase tracking-tight">
                        Xác minh cửa hàng
                      </AlertDialogTitle>
                      <AlertDialogDescription className="font-medium italic">
                        Bạn có chắc chắn muốn kích hoạt và xác minh cửa hàng **
                        {shop.name}**? Hành động này sẽ cho phép cửa hàng xuất
                        hiện công khai trên hệ thống.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl font-bold">
                        Hủy
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleVerify}
                        className="rounded-xl bg-[#950101] font-bold hover:bg-[#7a0101]"
                      >
                        Xác nhận kích hoạt
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              {/* <Button
                variant="destructive"
                className="bg-black/40 backdrop-blur-md border border-white/10 hover:bg-red-600 rounded-xl font-black uppercase tracking-widest text-[10px] px-6 h-10 transition-all"
              >
                Vô hiệu hóa
              </Button> */}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-12 bg-white">
        {/* LEFT: INFO & CONTACT */}
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#950101] flex items-center gap-3">
              <div className="w-8 h-[2px] bg-[#950101]" /> Giới thiệu
            </h3>
            <p className="text-slate-600 font-medium leading-relaxed italic border-l-4 border-slate-100 pl-6 text-lg">
              {shop.description || "Chưa có mô tả cho cửa hàng này."}
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                Địa điểm & Liên hệ
              </h3>
              {shop.locations?.map((loc) => (
                <div
                  key={loc.id}
                  className="bg-slate-50 p-6 rounded-[2rem] space-y-3 border border-slate-100"
                >
                  <div className="flex gap-3 items-start">
                    <MapPin className="w-4 h-4 text-[#950101] mt-1" />
                    <p className="text-sm font-bold text-slate-700">
                      {loc.address}, {loc.city}
                    </p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Phone className="w-4 h-4 text-[#950101]" />
                    <p className="text-sm font-black text-slate-900 italic">
                      {loc.phone || shop.phone}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                Chủ sở hữu
              </h3>
              {owner && (
                <div
                  className="group flex items-center gap-4 bg-white p-4 rounded-[2rem] border-2 border-slate-50 hover:border-[#950101] transition-all cursor-pointer shadow-sm"
                  onClick={() => setSelectedOwnerId(owner.id)}
                >
                  {owner.avatarUrl ? (
                    <img
                      src={owner.avatarUrl || "/placeholder-logo.png"}
                      className="w-14 h-14 rounded-2xl border-4 border-white shadow-2xl object-cover bg-white"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl border-4 border-white shadow-2xl bg-gradient-to-br from-[#950101] to-[#FFCFE9] flex items-center justify-center">
                      <span className="text-2xl font-black text-white uppercase italic">
                        {owner.fullName?.[0]}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                      {owner.fullName}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 italic">
                      Nhấp để xem hồ sơ
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 ml-auto text-slate-300 group-hover:text-[#950101] transition-colors" />
                </div>
              )}
            </div>
          </section>

          <div className="pt-6 space-y-12">
            <ServicePreview shopId={shop.id} />
            <CollectionPreview shopId={shop.id} />
          </div>
        </div>

        {/* RIGHT: METRICS & STATUS */}
        <div className="space-y-8">
          <div className="rounded-[2.5rem] p-8 text-white space-y-8 relative overflow-hidden shadow-xl bg-gradient-to-br from-[#950101] to-[#FFCFE9]">
            <div className="relative z-10 space-y-6">
              <h3 className="text-[15px] font-black uppercase tracking-[0.3em]">
                Chỉ số hiệu suất
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[12px] font-black uppercase tracking-widest">
                    Lượt đặt lịch
                  </p>
                  <p className="text-2xl font-black italic tracking-tighter">
                    {shopStats?.totalBookings ?? 0}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] font-black uppercase tracking-widest">
                    Đánh giá
                  </p>
                  <p className="text-2xl font-black italic tracking-tighter">
                    {shopStats?.averageRating?.toFixed(1) ?? "N/A"}
                  </p>
                </div>
              </div>
              <Separator className="bg-white/10" />
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-black uppercase">
                    Trạng thái
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        shop.isActive ? "bg-emerald-500" : "bg-red-500"
                      } shadow-[0_0_12px_rgba(16,185,129,0.5)]`}
                    />
                    <span className="text-[12px] font-black">
                      {shop.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[12px] font-black uppercase">
                  <span>Ngày tạo</span>
                  <span className="text-white italic">
                    {formatDate(shop.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#950101] opacity-20 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
      {selectedOwnerId && (
        <UserDetailModal
          userId={selectedOwnerId}
          open={!!selectedOwnerId}
          onClose={() => setSelectedOwnerId(null)}
          onUserUpdated={() => {
            setSelectedOwnerId(null);
            loadShopDetails();
          }}
        />
      )}
    </div>
  );
};

export default ShopDetailView;
