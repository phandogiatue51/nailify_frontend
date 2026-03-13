import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import ServiceItemForm from "@/components/serviceItem/ServiceItemForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronsLeft, Loader2 } from "lucide-react";
import { ComponentType } from "@/types/database";
import { useShopOwnerServiceItems } from "@/hooks/useServiceItems";
import { useNailArtistServiceItems } from "@/hooks/useNailArtistServiceItems";
import { useRequireRole } from "@/hooks/useRequireRole";

const CreateServiceItemPage = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { redirect, loading, user } = useRequireRole([1, 4]);

  const parsedType = parseInt(type || "0");
  const componentType: ComponentType =
    parsedType >= 0 && parsedType <= 4 ? (parsedType as ComponentType) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (redirect) return redirect;

  const isArtist = user.role === 4;
  const serviceItemsHook = isArtist
    ? useNailArtistServiceItems()
    : useShopOwnerServiceItems();

  const handleSubmit = async (formData: FormData) => {
    try {
      await serviceItemsHook.createServiceItem.mutateAsync(formData);
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
      {/* Header: Service Creation Branding */}
      <div className="px-6 pt-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="group rounded-full mr-4 border-2 border-slate-400 hover:border-[#950101] transition-all px-3"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600 group-hover:text-[#950101] transition-transform" />
          </Button>

          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D81B60]">
              Kiến Tạo Dịch Vụ
            </span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
              Thêm {componentLabels[componentType]}
            </h1>
          </div>
        </div>
      </div>

      {/* Form Body */}
      <div className="px-6">
        <div className="relative">
          {/* Decorative background element */}
          <div className="absolute -top-12 -left-6 w-32 h-32 bg-[#950101]/5 rounded-full blur-3xl -z-10" />

          <ServiceItemForm
            componentType={componentType}
            onSubmit={handleSubmit}
            isLoading={serviceItemsHook.createServiceItem.isPending}
          />

          {/* Cancel Action */}
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

export default CreateServiceItemPage;
