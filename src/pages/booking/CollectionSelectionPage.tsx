import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { useAllCustomerCollections, useCollections } from "@/hooks/useCustomer";
import { useQuery } from "@tanstack/react-query";
import { tagAPI } from "@/services/api";
import { TagDto } from "@/types/type";
import { TagCategory } from "@/types/filter";
import { CollectionFilterDto } from "@/types/filter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CollectionCard from "@/components/collection/CollectionCard";
import { Loader2, Search, X, ArrowLeft } from "lucide-react";

const CollectionSelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();

  // Get customer info from location state
  const { customerProfile } = location.state || {};

  // Filter states
  const [searchName, setSearchName] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");

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

  // Build filter params based on user role
  const filterParams = useMemo(() => {
    const params: CollectionFilterDto = {};

    // Add owner filter based on user role
    if (user?.role === 1 && user.shopId) {
      params.ShopId = user.shopId;
    } else if (user?.role === 4 && user.nailArtistId) {
      params.ArtistId = user.nailArtistId;
    }

    if (debouncedSearch) {
      params.Name = debouncedSearch;
    }

    if (selectedTags.length > 0) {
      params.TagIds = selectedTags;
    }

    return Object.keys(params).length > 0 ? params : undefined;
  }, [user, debouncedSearch, selectedTags]);

  // Fetch collections
  const { data: collections = [], isLoading } = useCollections(filterParams);

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

  const activeFilterCount = selectedTags.length + (searchName ? 1 : 0);

  const handleSelectCollection = (collection: any) => {
    const existingState = location.state || {};

    const bookingState: any = {
      ...existingState,
      selectedCollection: collection,
      collectionId: collection.id,
    };

    if (user?.role === 1 || user?.role === 3) {
      bookingState.shopId = user.shopId;
      bookingState.type = "shop";
    } else if (user?.role === 4) {
      bookingState.nailArtistId = user.nailArtistId;
      bookingState.type = "artist";
    }

    navigate("/customer-book", { state: bookingState });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1
          className="font-black tracking-tight uppercase text-xl bg-clip-text text-transparent pb-1"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
            WebkitBackgroundClip: "text",
          }}
        >
          Chọn set Nail
        </h1>
      </div>

      {/* Customer Info Banner */}
      {customerProfile && (
        <div className="bg-white border-b px-4 py-3">
          <p className="text-xs text-slate-500">Booking for</p>
          <p className="font-bold text-slate-900">{customerProfile.fullName}</p>
          <p className="text-xs text-slate-600">{customerProfile.phone}</p>
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* Filters */}
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm set nail ..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="pl-9 pr-4 py-2 w-full bg-white border-slate-200 rounded-lg"
            />
          </div>

          {/* Tags Filter */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white border-slate-200 flex-1 justify-between"
                >
                  <span>Lọc theo phân loại</span>
                  {selectedTags.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedTags.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 max-h-80 overflow-y-auto">
                {allTags.map((tag) => (
                  <DropdownMenuCheckboxItem
                    key={tag.id}
                    checked={selectedTags.includes(tag.id)}
                    onCheckedChange={() => toggleTag(tag.id)}
                  >
                    <div className="flex flex-col">
                      <span>{tag.name}</span>
                      <span className="text-xs text-slate-500">
                        {TagCategory[tag.category]}
                      </span>
                    </div>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearFilters}
                className="shrink-0"
                title="Clear all filters"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Selected Tags Display */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tagId) => {
                const tag = allTags.find((t) => t.id === tagId);
                return tag ? (
                  <Badge
                    key={tagId}
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    {tag.name}
                    <button
                      onClick={() => toggleTag(tagId)}
                      className="ml-1 hover:text-slate-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Collections Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#E288F9]" />
          </div>
        ) : collections.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className="cursor-pointer transform active:scale-95 transition-transform"
                  onClick={() => handleSelectCollection(collection)}
                >
                  <CollectionCard collection={collection} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-500">
                {activeFilterCount > 0
                  ? "Không có set nail phù hợp"
                  : "Không có set nail"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CollectionSelectionPage;
