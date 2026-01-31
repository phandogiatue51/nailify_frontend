import { useState } from "react";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { useAllShops } from "@/hooks/useShop";
import { useCustomerArtists } from "@/hooks/useCustomer";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, User, Store, Sparkles, Filter } from "lucide-react";
import ShopCard from "@/components/shop/ShopCard";
import NailArtistCard from "@/components/nailArtist/NailArtistCard";

const ExplorePage = () => {
  const { user, loading } = useAuthContext();
  const { data: shops, isLoading: shopsLoading } = useAllShops();
  const { data: artists, isLoading: artistsLoading } = useCustomerArtists();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("shops");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#E288F9]" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const filteredShops = shops?.filter((shop) =>
    [shop.name, shop.description, shop.address].some(field =>
      field?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ) || [];

  const filteredArtists = artists?.filter((artist) =>
    [artist.profile?.fullName, artist.address].some(field =>
      field?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ) || [];

  const isLoading = activeTab === "shops" ? shopsLoading : artistsLoading;

  return (
    <MobileLayout>
      <div className="bg-slate-50/50 min-h-screen pb-24">
        {/* Header & Search Area */}
        <div className="bg-white px-6 pt-8 pb-6 rounded-b-[3rem] shadow-sm">
          <div className="flex items-center gap-2 text-[#E288F9] mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Discover</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-6">
            Find your <span className="text-[#FFC988]">Vibe</span>
          </h1>

          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#E288F9] transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <Input
              placeholder={`Search for ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 pl-12 pr-12 rounded-2xl border-none bg-slate-100/80 focus-visible:ring-2 focus-visible:ring-[#E288F9]/20 font-medium text-slate-900 placeholder:text-slate-400 transition-all"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white shadow-sm border border-slate-100">
              <Filter className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-14 p-1.5 bg-white rounded-[1.5rem] shadow-sm mb-6 border border-slate-100">
              <TabsTrigger value="shops" className="rounded-xl font-bold data-[state=active]:bg-[#FFC988] data-[state=active]:text-white transition-all">
                <Store className="w-4 h-4 mr-2" />
                Salons
              </TabsTrigger>
              <TabsTrigger value="artists" className="rounded-xl font-bold data-[state=active]:bg-[#E288F9] data-[state=active]:text-white transition-all">
                <User className="w-4 h-4 mr-2" />
                Artists
              </TabsTrigger>
            </TabsList>

            <div className="px-1">
              <TabsContent value="shops" className="m-0 space-y-4">
                {isLoading ? (
                  <ExploreSkeleton />
                ) : filteredShops.length > 0 ? (
                  <div className="grid grid-cols-1 gap-5">
                    {filteredShops.map((shop) => (
                      <ShopCard key={shop.id} shop={shop} />
                    ))}
                  </div>
                ) : (
                  <EmptyExploreState query={searchQuery} type="shops" />
                )}
              </TabsContent>

              <TabsContent value="artists" className="m-0 space-y-4">
                {isLoading ? (
                  <ExploreSkeleton />
                ) : filteredArtists.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {filteredArtists.map((artist) => (
                      <NailArtistCard key={artist.id} artist={artist} />
                    ))}
                  </div>
                ) : (
                  <EmptyExploreState query={searchQuery} type="artists" />
                )}
              </TabsContent>
            </div>
          </Tabs>

          <div className="py-4 border-t border-slate-200/60 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {filteredShops.length} Salons • {filteredArtists.length} Artists near you
            </p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

// Simplified Skeleton for loading
const ExploreSkeleton = () => (
  <div className="grid grid-cols-2 gap-4 animate-pulse">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="h-48 bg-slate-200 rounded-[2rem]" />
    ))}
  </div>
);

// Improved Empty State
const EmptyExploreState = ({ query, type }: { query: string; type: string }) => (
  <div className="flex flex-col items-center justify-center py-20 px-10 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
      <Search className="w-10 h-10 text-slate-200" />
    </div>
    <h3 className="font-bold text-slate-900">
      {query ? `No ${type} matching "${query}"` : `No ${type} available`}
    </h3>
    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
      Try checking your spelling or using more general keywords.
    </p>
  </div>
);

export default ExplorePage;