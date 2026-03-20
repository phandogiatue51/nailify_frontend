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
import { ArrowLeft, MapPin, Phone, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingFilter from "@/components/booking/BookingFilter";
import GuestCollectionTab from "@/components/booking/GuestCollectionTab";
import GuestServiceTab from "@/components/booking/GuestServiceTab";
import { ServiceItem } from "@/types/database";
import CustomerInfoBanner from "@/components/booking/CustomerInfoBanner";

const CollectionSelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();

  // Get customer info from location state
  const state = location.state || {};
  const customerProfile = state.customerProfile ||
    (state.customerName && {
      fullName: state.customerName,
      phone: state.customerPhone,
      address: state.customerAddress || '',
    });

  // Tab state
  const [activeTab, setActiveTab] = useState("collections");

  // Filter states
  const [searchName, setSearchName] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Selection states
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);

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

    if (selectedTags.length > 0) {
      params.TagIds = selectedTags;
    }

    return Object.keys(params).length > 0 ? params : undefined;
  }, [user, debouncedSearch, selectedTags]);

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
    setSelectedCollection(collection);
    // Stay on the same page, don't navigate
  };

  const handleSelectService = (service: ServiceItem) => {
    console.log('🖱️ Service clicked:', service.name);
    setSelectedServices(prev => {
      const isSelected = prev.find(s => s.id === service.id);
      let newSelected;
      if (isSelected) {
        newSelected = prev.filter(s => s.id !== service.id);
        console.log('❌ Removed service. New count:', newSelected.length);
      } else {
        newSelected = [...prev, service];
        console.log('✅ Added service. New count:', newSelected.length);
      }
      console.log('Current selected services:', newSelected.map(s => s.name));
      return newSelected;
    });
  };

  const handleConfirm = () => {
    console.log('🎯 CONFIRM BUTTON CLICKED');
    console.log('selectedCollection:', selectedCollection?.name);
    console.log('selectedServices:', selectedServices.map(s => s.name));
    console.log('selectedServices count:', selectedServices.length);

    const existingState = location.state || {};

    const bookingState: any = {
      ...existingState,
      selectedCollection: selectedCollection,
      collectionId: selectedCollection?.id || null,
      selectedItems: selectedServices,
    };

    console.log('📤 Navigating with bookingState.selectedItems:', bookingState.selectedItems.map(s => s.name));

    if (user?.role === 1 || user?.role === 3) {
      bookingState.shopId = user.shopId;
      bookingState.type = "shop";
    } else if (user?.role === 4) {
      bookingState.nailArtistId = user.nailArtistId;
      bookingState.type = "artist";
    }

    navigate("/customer-book", { state: bookingState });
  };

  const totalSelectedItems = (selectedCollection ? 1 : 0) + selectedServices.length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b px-4 py-3 flex items-center gap-3">
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
          Chọn dịch vụ / set nail
        </h1>
      </div>

      <CustomerInfoBanner profile={customerProfile} />

      {/* Selected Summary */}
      {totalSelectedItems > 0 && (
        <div className="bg-white border-b px-4 py-3">
          <p className="text-xs text-slate-500 font-medium">Đã chọn:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {selectedCollection && (
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-[#E288F9]/10 text-[#E288F9] text-xs font-bold">
                Set: {selectedCollection.name}
              </span>
            )}
            {selectedServices.map(service => (
              <span key={service.id} className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-xs">
                {service.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
              selectedCollectionId={selectedCollection?.id}
            />
          </TabsContent>

          <TabsContent value="services" className="mt-0">
            <GuestServiceTab
              services={services}
              isLoading={servicesLoading}
              onSelect={handleSelectService}
              activeFilterCount={activeFilterCount}
              selectedItemIds={selectedServices.map(s => s.id!)}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirm Button - Always show if anything is selected */}
      {totalSelectedItems > 0 && (
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <Button
            onClick={handleConfirm}
            style={{
              background:
                "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
              border: "none",
            }}
            className="font-black tracking-tight uppercase text-lg rounded-[2rem] w-full h-12"
          >
            Tiếp theo ({totalSelectedItems} dịch vụ)
          </Button>
        </div>
      )}
    </div>
  );
};

export default CollectionSelectionPage;