import { useState, useEffect, useMemo } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import {
  useCustomerArtistById,
  useAllCustomerCollections,
} from "@/hooks/useCustomer";
import {
  ArrowLeft,
  Loader2,
  Star,
  Heart,
  Share2,
  Wand2,
  Palette,
  Sparkles,
  MessageCircle,
  Search,
  X,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CollectionCard from "@/components/collection/CollectionCard";
import { useStartConversation } from "@/hooks/useChat";
import { useQuery } from "@tanstack/react-query";
import { ratingAPI, tagAPI } from "@/services/api";
import { TagDto } from "@/types/type";
import { TagCategory } from "@/types/filter";
import { CollectionFilterDto } from "@/types/filter";
import { TagBadge } from "@/components/badge/TagBadge";
import { RatingSummaryDto } from "@/types/database";

const ArtistDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuthContext();

  // Filter states
  const [searchName, setSearchName] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [artistRating, setArtistRating] = useState<RatingSummaryDto | null>(
    null,
  );
  const [ratingLoading, setRatingLoading] = useState(false);

  const { data: artist, isLoading: artistLoading } = useCustomerArtistById(id);
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

  useEffect(() => {
    const fetchArtistRating = async () => {
      if (!artist?.id) {
        return;
      }

      setRatingLoading(true);
      try {
        const response = await ratingAPI.getByArtistId(artist.id);

        setArtistRating(response);
      } catch (error) {
        console.error("Failed to fetch artist rating:", error);
        setArtistRating(null);
      } finally {
        setRatingLoading(false);
      }
    };

    fetchArtistRating();
  }, [artist?.id]);

  const filterParams = useMemo(() => {
    if (!id) return undefined;

    const params: CollectionFilterDto = {
      ArtistId: id,
    };

    if (debouncedSearch) {
      params.Name = debouncedSearch;
    }

    if (selectedTags.length > 0) {
      params.TagIds = selectedTags;
    }

    return params;
  }, [id, debouncedSearch, selectedTags]);

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

  const handleArtistChat = async () => {
    try {
      await startConversation.mutateAsync({
        type: "individual",
        id: artist.profileId,
      });
    } catch (error) {
      console.error("Failed to start artist conversation:", error);
    }
  };

  if (loading || artistLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#E288F9]" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!artist) return <Navigate to="/explore" replace />;

  return (
    <div className="relative bg-slate-50/30 min-h-screen">
      {/* Artist Hero */}
      <div className="relative h-80">
        {artist.avatarUrl ? (
          <img
            src={artist.avatarUrl}
            alt={artist.fullName}
            className="w-full h-full rounded-lg object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-lg object-cover bg-gradient-to-br from-[#950101] to-[#FFCFE9] flex items-center justify-center">
            <span className="text-4xl font-bold text-white uppercase">
              {artist.fullName?.[0] || "U"}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/10" />

        {/* Back and Share buttons */}
        <div className="absolute top-6 left-4 right-4 flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="group rounded-full mr-4 border-2 border-slate-400 hover:border-[#950101] transition-all px-3"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600 group-hover:text-[#950101] transition-transform" />
          </Button>
        </div>

        {/* Artist Info Overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">
              {artist.fullName}
            </h1>
            <div className="flex items-center gap-1 bg-white/80 backdrop-blur px-2 py-0.5 rounded-full">
              {ratingLoading ? (
                <div className="inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                  <Loader2 className="w-3 h-3 animate-spin text-slate-400" />
                </div>
              ) : (
                artistRating && (
                  <div className="inline-flex items-center gap-1.5 bg-amber-50/50 px-2.5 py-1 rounded-full border border-amber-100 text-sm font-black">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-slate-700">
                      {artistRating.averageRating.toFixed(1)}
                    </span>
                    <span className="text-slate-400">
                      ({artistRating.totalRatings})
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          {artist.bio && (
            <p className="text-sm text-slate-600 line-clamp-2">{artist.bio}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 -mt-4 relative z-20">
        <div className="flex gap-3">
          <Button
            className="font-black tracking-tight uppercase rounded-[2rem] w-full"
            onClick={handleArtistChat}
            style={{
              background:
                "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
              border: "none",
            }}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Kết nối ngay
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* 1. Featured Custom Request Card */}
        <Card className="overflow-hidden border-0 shadow-2xl shadow-[#950101]/10 bg-white rounded-[2rem] relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFCFE9]/30 blur-3xl rounded-full -mr-16 -mt-16" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#950101] to-[#D81B60] flex items-center justify-center shadow-lg shadow-[#950101]/20 shrink-0">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-slate-800 uppercase tracking-tighter text-sm">
                  Bạn có ý tưởng riêng?
                </h3>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                  Hãy tự thiết kế bộ móng của riêng bạn.
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate(`/artist/${id}/custom`)}
              className="h-10 w-full px-6 font-black tracking-widest uppercase text-[10px] rounded-full text-white transition-all active:scale-95 shadow-md shadow-[#950101]/20 border-none"
              style={{
                background:
                  "linear-gradient(135deg, #950101 0%, #D81B60 100%)",
              }}
            >
              Bắt Đầu Thiết Kế
            </Button>
          </CardContent>
        </Card>

        {/* 2. Portfolio Header & Search */}
        <div className="space-y-4">
          <div className="flex justify-between items-end px-1">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
              Portfolio
            </h2>
            {collections?.length > 0 && (
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {collections.length} set Nail
              </span>
            )}
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#950101] transition-colors" />
            <Input
              type="text"
              placeholder="Tìm kiếm set nail phù hợp ..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="pl-11 pr-4 h-12 w-full bg-white border-none rounded-2xl shadow-xl shadow-[#950101]/5 focus-visible:ring-2 focus-visible:ring-[#FFCFE9] text-sm font-medium"
            />
          </div>
        </div>

        {/* 3. High-End Tag Filter */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Phân loại
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-[10px] font-black text-[#950101] uppercase tracking-widest underline decoration-2 underline-offset-4"
              >
                Làm mới
              </button>
            )}
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 pt-2">
            {allTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className="shrink-0 transition-all active:scale-90"
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

        {/* 4. Portfolio Results */}
        {collectionsLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#950101]" />
          </div>
        ) : collections?.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="cursor-pointer group relative"
                onClick={() => navigate(`/collections/${collection.id}`)}
              >
                <div className="transition-all duration-300 group-active:scale-95 group-hover:-translate-y-1">
                  <CollectionCard collection={collection} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-2 bg-white/50 rounded-[2rem]">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 grayscale opacity-50">
                <Palette className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm">
                {activeFilterCount > 0
                  ? "Không tìm thấy kết quả"
                  : "Portfolio đang hoàn thiện"}
              </h3>
              <p className="text-[11px] font-medium text-slate-500 mt-2 mb-6 max-w-[200px] mx-auto leading-relaxed">
                {activeFilterCount > 0
                  ? "Hãy thử chọn phong cách khác hoặc từ khóa tìm kiếm khác."
                  : `${artist.fullName.split(" ")[0]} đang tuyển chọn những tác phẩm tâm huyết nhất.`}
              </p>
              <Button
                onClick={() => navigate(`/artist/${id}/custom`)}
                className="w-full h-12 bg-[#950101] text-white rounded-xl font-black uppercase tracking-widest text-[10px]"
              >
                <Wand2 className="w-4 h-4 mr-2" /> Bắt Đầu Thiết Kế Riêng
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ArtistDetailPage;
