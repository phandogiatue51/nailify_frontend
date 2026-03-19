import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import {
  useCollections,
  useAllCustomerService,
} from "@/hooks/useCustomer";
import { useQuery } from "@tanstack/react-query";
import { tagAPI } from "@/services/api";
import { TagDto } from "@/types/type";
import {
  CollectionFilterDto,
  ServiceItemFilterDto,
} from "@/types/filter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingFilter from "@/components/booking/BookingFilter";
import GuestCollectionTab from "@/components/booking/GuestCollectionTab";
import GuestServiceTab from "@/components/booking/GuestServiceTab";
import { ServiceItem } from "@/types/database";

const CollectionSelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();

  // Get customer info from location state
  const { customerProfile } = location.state || {};

  // Tab state
  const [activeTab, setActiveTab] = useState("collections");

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

  // Build filter params for collections
  const collectionFilterParams = useMemo(() => {
    const params: CollectionFilterDto = {};

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

  // Build filter params for services
  const serviceFilterParams = useMemo(() => {
    const params: ServiceItemFilterDto = {};

    if (user?.role === 1 && user.shopId) {
      params.ShopId = user.shopId;
    } else if (user?.role === 4 && user.nailArtistId) {
      params.NailArtistId = user.nailArtistId;
    }

    if (debouncedSearch) {
      params.SearchTerm = debouncedSearch;
    }

    // Note: ServiceItemFilterDto currently doesn't support TagIds
    // but TagSelector is shared. If service doesn't use tags, it will just show all with current name search.

    return Object.keys(params).length > 0 ? params : undefined;
  }, [user, debouncedSearch]);

  // Fetch data
  const { data: collections = [], isLoading: collectionsLoading } = useCollections(collectionFilterParams);
  const { data: services = [], isLoading: servicesLoading } = useAllCustomerService(serviceFilterParams);

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
      selectedItems: [], // Clear items if collection is selected
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

  const handleSelectService = (service: ServiceItem) => {
    const existingState = location.state || {};

    const bookingState: any = {
      ...existingState,
      selectedCollection: null,
      collectionId: null,
      selectedItems: [service],
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
          Chọn dịch vụ / collection
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
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="collections">Set Nail</TabsTrigger>
            <TabsTrigger value="services">Dịch vụ lẻ</TabsTrigger>
          </TabsList>

          <div className="mb-4">
            <BookingFilter
              searchName={searchName}
              setSearchName={setSearchName}
              selectedTags={selectedTags}
              toggleTag={toggleTag}
              allTags={allTags}
              clearFilters={clearFilters}
              placeholder={activeTab === "collections" ? "Tìm kiếm set nail ..." : "Tìm kiếm dịch vụ ..."}
            />
          </div>

          <TabsContent value="collections" className="mt-0">
            <GuestCollectionTab
              collections={collections}
              isLoading={collectionsLoading}
              onSelect={handleSelectCollection}
              activeFilterCount={activeFilterCount}
            />
          </TabsContent>

          <TabsContent value="services" className="mt-0">
            <GuestServiceTab
              services={services}
              isLoading={servicesLoading}
              onSelect={handleSelectService}
              activeFilterCount={activeFilterCount}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CollectionSelectionPage;
