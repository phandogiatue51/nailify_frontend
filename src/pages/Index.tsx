"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate, Link } from "react-router-dom";
import { useAllCustomerCollections } from "@/hooks/useCustomer";
import CollectionCard from "@/components/collection/CollectionCard";
import { Loader2, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { TagDto } from "@/types/type";
import { tagAPI } from "@/services/api";
import { cn } from "@/lib/utils";
import { CollectionFilterDto } from "@/types/filter";
import { TagBadge } from "@/components/badge/TagBadge";

const Index = () => {
  const { user, loading } = useAuthContext();

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

  // Build filter params
  const filterParams = useMemo(() => {
    const params: CollectionFilterDto = {};

    if (debouncedSearch) {
      params.Name = debouncedSearch;
    }

    if (selectedTags.length > 0) {
      params.TagIds = selectedTags;
    }

    return Object.keys(params).length > 0 ? params : undefined;
  }, [debouncedSearch, selectedTags]);

  // Fetch collections with filters
  const { data: allCollections = [], isLoading: collectionsLoading } =
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

  // Auth checks
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-[#E288F9]" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  // Role-based redirects
  switch (user.role) {
    case 1:
      return <Navigate to="/shop-dashboard" replace />;
    case 2:
      return <Navigate to="/admin" replace />;
    case 3:
      return <Navigate to="/staff-dashboard" replace />;
    case 4:
      return <Navigate to="/artist-dashboard" replace />;
    default:
      break;
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* 1. BRANDED HEADER */}
      <Header title="Nailify" hasNotification={true} />

      <div className="px-4 pt-6 space-y-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
            Hi, {user?.fullName}
          </h2>
          <p className="text-[#950101] font-bold text-xs uppercase tracking-[0.15em] opacity-80 mt-2">
            Ready for a fresh set of nails?
          </p>
        </div>

        {/* 3. FLOATING SEARCH & FILTER */}
        <div className="space-y-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#950101] transition-colors" />
            <Input
              type="text"
              placeholder="Search aesthetics..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="pl-11 pr-4 h-14 w-full bg-white border-none rounded-2xl shadow-xl shadow-[#950101]/5 focus-visible:ring-2 focus-visible:ring-[#FFCFE9] text-sm font-medium"
            />
          </div>

          {/* 4. HORIZONTAL TAG CHIPS (Better than Dropdown) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Categories
              </span>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-[10px] font-black text-[#950101] uppercase tracking-widest underline underline-offset-4"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 pt-2">
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
        </div>

        {/* 5. RESULTS GRID */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-5 bg-[#950101] rounded-full" />
            <h3 className="font-black text-slate-800 uppercase tracking-tight">
              Featured Looks
            </h3>
          </div>

          {collectionsLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-10 h-10 border-4 border-[#FFCFE9] border-t-[#950101] rounded-full animate-spin" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Finding the best sets...
              </p>
            </div>
          ) : allCollections.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {allCollections.map((collection) => (
                <Link
                  key={collection.id}
                  to={`/collections/${collection.id}`}
                  className="block group"
                >
                  <div className="transition-all duration-300 group-active:scale-95 group-hover:-translate-y-1">
                    <CollectionCard collection={collection} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              message={
                activeFilterCount > 0
                  ? "No matches for these filters"
                  : "Looks like we're fresh out of sets"
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <Card className="border-dashed border-2 bg-transparent">
    <CardContent className="py-12 text-center">
      <p className="text-slate-400 font-medium text-sm">{message}</p>
    </CardContent>
  </Card>
);

export default Index;
