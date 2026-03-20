// pages/EditServiceItemPage.tsx
import { useParams, useNavigate, useLocation } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import ServiceItemForm from "@/components/serviceItem/ServiceItemForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { serviceItemAPI } from "@/services/api";
import { useRequireRole } from "@/hooks/useRequireRole";
import { useShopOwnerServiceItems } from "@/hooks/useServiceItems";
import { useNailArtistServiceItems } from "@/hooks/useNailArtistServiceItems";
const EditServiceItemPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { redirect, loading, user } = useRequireRole([1, 4]);
  const shopHook = useShopOwnerServiceItems();
  const artistHook = useNailArtistServiceItems();

  const { data: item, isLoading: itemLoading } = useQuery({
    queryKey: ["service-item", id],
    queryFn: async () => {
      if (!id) return null;
      return await serviceItemAPI.getById(id);
    },
    enabled: !!id,
  });

  if (redirect) return redirect;

  if (loading || itemLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isArtist = user?.role === 4;
  const serviceItemsHook = isArtist ? artistHook : shopHook;

  const handleSubmit = async (formData: FormData) => {
    try {
      await serviceItemsHook.updateServiceItem.mutateAsync({
        id: item.id,
        formData,
      });
      navigate(-1);
    } catch (err) {
      console.error(err);
    }
  };

  const componentLabels = [
    "Lớp Nền",
    "Tạo Dáng",
    "Sơn Bóng",
    "Trang Trí",
    "Đính Đá",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header: Refinement Studio */}
      <div className="px-6 pt-4">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mt-1 rounded-2xl mr-4 bg-slate-50 hover:bg-[#950101]/5 text-slate-600 hover:text-[#950101] transition-all active:scale-90 shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#950101]">
              Phòng Tinh Chỉnh
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
              Chỉnh sửa {componentLabels[item.componentType]}
            </h1>
          </div>
        </div>
      </div>

      {/* Form Body */}
      <div className="px-6">
        <div className="relative">
          {/* Subtle decorative glow for Edit mode */}
          <div className="absolute -top-10 -right-4 w-32 h-32 bg-[#E288F9]/10 rounded-full blur-3xl -z-10" />

          <ServiceItemForm
            componentType={item.componentType}
            initialData={item}
            onSubmit={handleSubmit}
            isLoading={serviceItemsHook.updateServiceItem.isPending}
          />

          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full py-4 text-[11px] font-black uppercase tracking-[0.2em] text-red-500 transition-all"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditServiceItemPage;
