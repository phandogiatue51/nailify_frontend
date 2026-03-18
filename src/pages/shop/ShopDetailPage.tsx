import { useState, useEffect, useMemo } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import {
  useCustomerShopById,
  useAllCustomerCollections,
} from "@/hooks/useCustomer";
import {
  Share2,
  Loader2,
  ArrowLeft,
  Wand2,
  Sparkles,
  MessageCircle,
  Heart,
  Search,
  X,
  Star,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import CollectionCard from "@/components/collection/CollectionCard";
import { useStartConversation } from "@/hooks/useChat";
import { useQuery } from "@tanstack/react-query";
import { ratingAPI, tagAPI } from "@/services/api";
import { TagDto } from "@/types/type";
import { CollectionFilterDto, TagCategory } from "@/types/filter";
import { TagBadge } from "@/components/badge/TagBadge";
import { RatingSummaryDto } from "@/types/database";

const ShopDetailPage = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuthContext();
  const [shopRating, setShopRating] = useState<RatingSummaryDto | null>(null);
  const [ratingLoading, setRatingLoading] = useState(false);

  // Filter states
  const [searchName, setSearchName] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: shop, isLoading: shopLoading } = useCustomerShopById(shopId);
  const startConversation = useStartConversation();

  // Fetch all tags for filter options
  const { data: allTags = [] } = useQuery<TagDto[]>({
    queryKey: ["tags"],
    queryFn: () => tagAPI.getAllTags(),
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchName);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchName]);

  // Build filter params with shopId
  const filterParams = useMemo(() => {
    if (!shopId) return undefined;

    const params: CollectionFilterDto = {
      ShopId: shopId,
    };

    if (debouncedSearch) {
      params.Name = debouncedSearch;
    }

    if (selectedTags.length > 0) {
      params.TagIds = selectedTags;
    }

    return params;
  }, [shopId, debouncedSearch, selectedTags]);

  // Fetch collections with filters
  const { data: collections = [], isLoading: collectionsLoading } =
    useAllCustomerCollections(filterParams);

  // Handle tag selection
  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchName("");
    setSelectedTags([]);
  };

  useEffect(() => {
    const fetchShopRating = async () => {
      if (!shop?.id) {
        return;
      }

      setRatingLoading(true);
      try {
        const response = await ratingAPI.getByShopId(shop.id);

        setShopRating(response);
      } catch (error) {
        console.error("Failed to fetch shop rating:", error);
        setShopRating(null);
      } finally {
        setRatingLoading(false);
      }
    };

    fetchShopRating();
  }, [shop?.id]);

  const activeFilterCount = selectedTags.length + (searchName ? 1 : 0);

  const handleShopChat = async () => {
    try {
      await startConversation.mutateAsync({
        type: "shop",
        id: shopId,
      });
    } catch (error) {
      console.error("Failed to start shop conversation:", error);
    }
  };

  if (loading || shopLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!shop) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative bg-slate-50/30 min-h-screen">
      {/* Immersive Header */}
      <div className="relative h-40 overflow-hidden">
        {shop.coverUrl ? (
          <img src={shop.coverUrl} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#950101] to-[#FFCFE9] flex items-center justify-center" />
        )}

        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-6 left-4 right-4 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="group rounded-full mr-4 border-2 border-slate-400 hover:border-[#950101] transition-all px-3"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600 group-hover:text-[#950101] transition-transform" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-2xl bg-white/90 backdrop-blur"
          >
            <Share2 className="w-5 h-5 text-slate-900" />
          </Button>
        </div>
        <div className="absolute -bottom-1 left-0 right-0 h-8 bg-slate-50 rounded-t-[3rem]" />
      </div>

      <div className="px-6 -mt-16 relative z-10">
        <div className="bg-white rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-white/50 backdrop-blur-sm">
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <div className="space-y-1">
                <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none">
                  {shop.name}
                </h1>
              </div>

              {ratingLoading ? (
                <div className="inline-flex items-center bg-slate-50 px-3 py-1 rounded-full">
                  <Loader2 className="w-3 h-3 animate-spin text-slate-400" />
                </div>
              ) : (
                shopRating && (
                  <div className="inline-flex items-center gap-1.5 bg-amber-50/50 px-3 py-1 rounded-full border border-amber-100/50">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-md font-black text-slate-700">
                      {shopRating.averageRating.toFixed(1)}
                    </span>
                    <span className="text-sm font-bold text-slate-400 ml-0.5">
                      ({shopRating.totalRatings} lượt đánh giá)
                    </span>
                  </div>
                )
              )}
            </div>

            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#950101] to-[#FFCFE9] rounded-full blur-md opacity-20 animate-pulse" />
              {shop.logoUrl ? (
                <img
                  src={shop.logoUrl}
                  alt="logo"
                  className="relative w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm"
                />
              ) : (
                <div className="relative w-20 h-20 rounded-full border-4 border-white shadow-sm bg-gradient-to-br from-[#950101] to-[#FFCFE9] flex items-center justify-center">
                  <span className="text-2xl font-black text-white uppercase">
                    {shop.name?.[0] || "U"}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-50 mb-6">
            <p className="text-sm text-slate-500 leading-relaxed font-medium italic">
              {shop.description
                ? `"${shop.description}"`
                : "Trải nghiệm đặt lịch nail thông minh."}
            </p>
          </div>

          <Button
            onClick={handleShopChat}
            className="w-full h-14 font-black tracking-widest uppercase rounded-full bg-gradient-to-r from-[#950101] via-[#D81B60] to-[#FFCFE9] hover:opacity-90 shadow-[0_10px_25px_rgba(216,27,96,0.2)] text-white border-none transition-all active:scale-[0.98]"
          >
            <MessageCircle className="w-5 h-5 mr-3" />
            Kết nối ngay
          </Button>
        </div>
      </div>

      <div className="px-4 mt-6">
        <Card className="overflow-hidden border-0 shadow-lg rounded-3xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#950101] to-[#ffcfe9] flex items-center justify-center">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-slate-900">
                  Bạn muốn chất riêng?
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  Tự tạo mẫu móng thiết kế của riêng bạn
                </p>
              </div>
              <Button
                onClick={() => navigate(`/shop/${shopId}/custom`)}
                size="sm"
                className="font-black tracking-tight uppercase rounded-[2rem]"
                style={{
                  background:
                    "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
                  border: "none",
                }}
              >
                Thiết Kế Ngay
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lookbook Section */}
      <div className="p-4 mt-2 space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
              Lookbook
            </h2>
            <p className="text-[10px] font-black text-[#950101] uppercase tracking-[0.2em] opacity-70 mt-2">
              Các set Nail khả dụng
            </p>
          </div>
          {collections && (
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md">
              {collections.length} Sets
            </span>
          )}
        </div>

        {/* Search Bar - Floating Style */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#950101] transition-colors" />
          <Input
            type="text"
            placeholder="Tìm kiếm set thích hợp ..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="pl-11 pr-4 h-12 w-full bg-white border-none rounded-2xl shadow-xl shadow-[#950101]/5 focus-visible:ring-2 focus-visible:ring-[#FFCFE9] text-sm font-medium"
          />
        </div>

        {/* Tags Scroll Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Lọc theo phân loại
            </h3>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-[10px] font-black text-[#950101] uppercase tracking-widest flex items-center gap-1 hover:opacity-70 transition-opacity"
              >
                <X className="w-3 h-3" /> Làm mới
              </button>
            )}
          </div>

          {/* Horizontal Scroll of TagBadges */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 pt-2">
            {allTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className="shrink-0 transition-transform active:scale-90"
              >
                <TagBadge
                  tag={tag}
                  size="md"
                  selected={selectedTags.includes(tag.id)}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        {collectionsLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#FFCFE9] border-t-[#950101] rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              Đang tìm ...
            </p>
          </div>
        ) : collections && collections.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="cursor-pointer group"
                onClick={() => navigate(`/collections/${collection.id}`)}
              >
                <div className="transition-transform duration-300 group-active:scale-95">
                  <CollectionCard collection={collection} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] p-8 border border-dashed border-slate-200 text-center shadow-sm">
            <div className="w-16 h-16 bg-[#FFCFE9]/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-[#950101]" />
            </div>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
              Không tìm thấy mẫu
            </h3>
            <p className="text-slate-400 text-sm mt-2 mb-6">
              Chưa tìm được "vibe" ưng ý? Hãy tự thiết kế bộ móng của riêng bạn.
            </p>
            <Button
              onClick={() => navigate(`/shop/${shopId}/custom`)}
              className="w-full h-12 rounded-2xl bg-[#950101] text-white font-black uppercase tracking-widest text-[10px]"
            >
              <Wand2 className="w-4 h-4 mr-2" /> Bắt Đầu Thiết Kế Riêng
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDetailPage;
