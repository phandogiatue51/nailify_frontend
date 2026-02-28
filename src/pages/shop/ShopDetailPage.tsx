import { useState, useEffect, useMemo } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import {
  useCustomerShopById,
  useCustomerServiceItems,
  useCustomerCollections,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CollectionCard from "@/components/collection/CollectionCard";
import { useStartConversation } from "@/hooks/useChat";
import { useQuery } from "@tanstack/react-query";
import { tagAPI } from "@/services/api";
import { TagDto } from "@/types/type";
import { CollectionFilterDto, TagCategory } from "@/types/filter";
import { TagBadge } from "@/components/badge/TagBadge";

const ShopDetailPage = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuthContext();

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

  // Count active filters
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
            variant="secondary"
            size="icon"
            className="rounded-2xl bg-white/90 backdrop-blur"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5 text-slate-900" />
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

      {/* Shop Info Card */}
      <div className="px-6 -mt-16 relative z-10">
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 border border-white">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              {shop.name}
            </h1>

            {shop.logoUrl ? (
              <img
                src={shop.logoUrl}
                className="w-16 h-16 rounded-full object-cover border-2 border-slate-50 shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-full border-2 border-slate-50 shadow-sm bg-gradient-to-br from-[#950101] to-[#FFCFE9] flex items-center justify-center">
                <span className="text-xl font-bold text-white uppercase">
                  {shop.name?.[0] || "U"}
                </span>
              </div>
            )}
          </div>

          <p className="text-sm text-slate-400 leading-relaxed italic mt-3">
            "{shop.description || "Welcome to our studio."}"
          </p>
        </div>
      </div>

      <div className="px-6 -mt-4 relative z-20">
        <div className="flex gap-3">
          <Button
            className="font-black tracking-tight uppercase rounded-[2rem] w-full"
            onClick={handleShopChat}
            style={{
              background:
                "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
              border: "none",
            }}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat Now
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-[2rem] border border-pink-300 bg-white shadow-sm"
          >
            <Heart className="w-4 h-4 text-pink-500" />
          </Button>
        </div>
      </div>

      <div className="px-4 mt-6">
        <Card className="overflow-hidden border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#950101] to-[#ffcfe9] flex items-center justify-center">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-slate-900">
                  Want something unique?
                </h3>
                <p className="text-sm text-slate-500">
                  Create your own custom nail design
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
                Customize
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
            <p className="text-[10px] font-black text-[#950101] uppercase tracking-[0.2em] opacity-70">
              Curated Inspirations
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
            placeholder="Search aesthetics (minimal, bold...)"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="pl-11 pr-4 h-12 w-full bg-white border-none rounded-2xl shadow-xl shadow-[#950101]/5 focus-visible:ring-2 focus-visible:ring-[#FFCFE9] text-sm font-medium"
          />
        </div>

        {/* Tags Scroll Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Filter by Category
            </h3>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-[10px] font-black text-[#950101] uppercase tracking-widest flex items-center gap-1 hover:opacity-70 transition-opacity"
              >
                <X className="w-3 h-3" /> Reset
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
              Polishing the gallery...
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
          /* Custom Design Call-to-Action for Empty State */
          <div className="bg-white rounded-[2.5rem] p-8 border border-dashed border-slate-200 text-center shadow-sm">
            <div className="w-16 h-16 bg-[#FFCFE9]/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-[#950101]" />
            </div>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
              No match found
            </h3>
            <p className="text-slate-400 text-sm mt-2 mb-6">
              Can't find the perfect vibe? Design your own custom set.
            </p>
            <Button
              onClick={() => navigate(`/shop/${shopId}/custom`)}
              className="w-full h-12 rounded-2xl bg-[#950101] text-white font-black uppercase tracking-widest text-[10px]"
            >
              <Wand2 className="w-4 h-4 mr-2" /> Start Custom Design
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDetailPage;
