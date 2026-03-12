import { useNavigate, useLocation } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import CollectionForm from "@/components/collection/CollectionForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { serviceItemAPI } from "@/services/api";
import { useRequireRole } from "@/hooks/useRequireRole";
import { useNailArtistCollections } from "@/hooks/useNailArtistCollections";
import { useShopOwnerCollections } from "@/hooks/useCollections";
const CreateCollectionPage = () => {
  const navigate = useNavigate();
  const { redirect, loading, user } = useRequireRole([1, 4]);

  if (redirect) return redirect;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isArtist = user.role === 4;

  const { data: serviceItems = [], isLoading: itemsLoading } = useQuery({
    queryKey: [isArtist ? "artist-service-items" : "shop-owner-service-items"],
    queryFn: async () => {
      try {
        return isArtist
          ? await serviceItemAPI.getByArtistAuth()
          : await serviceItemAPI.getByShopAuth();
      } catch (error) {
        console.error("Error fetching service items:", error);
        return [];
      }
    },
  });

  const collectionsHook = isArtist
    ? useNailArtistCollections()
    : useShopOwnerCollections();

  const handleSubmit = async (formData: FormData) => {
    try {
      await collectionsHook.createCollection.mutateAsync(formData);
      navigate(isArtist ? "/my-artist" : "/my-shop");
    } catch (error) {
      console.error("Failed to create collection:", error);
    }
  };

  if (itemsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 pt-2">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="group rounded-full border-2 border-slate-400 hover:border-[#950101] transition-all px-3"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600 group-hover:text-[#950101] transition-transform" />
          </Button>

          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D81B60]">
              Xưởng Sáng Tạo
            </span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
              Tạo Bộ Sưu Tập
            </h1>
          </div>
        </div>
      </div>

      {/* Form Body */}
      <div className="px-6">
        <div className="relative">
          {/* Subtle decorative element to anchor the form */}
          <div className="absolute -top-4 -left-2 w-12 h-12 bg-[#FFCFE9]/20 rounded-full blur-2xl -z-10" />

          <CollectionForm
            serviceItems={serviceItems}
            onSubmit={handleSubmit}
            isLoading={collectionsHook.createCollection.isPending}
          />

          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full py-4 text-[11px] font-black uppercase tracking-[0.2em] text-red-500 transition-all active:letter-spacing-widest rounded-3xl"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCollectionPage;
