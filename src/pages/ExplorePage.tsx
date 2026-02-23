import { useState } from "react";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import { useAllShops } from "@/hooks/useShop";
import { useCustomerArtists } from "@/hooks/useCustomer";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, User, Store, Sparkles, Filter } from "lucide-react";
import ShopCard from "@/components/shop/ShopCard";
import NailArtistCard from "@/components/nailArtist/NailArtistCard";
import { ExploreSkeleton } from "@/components/ui/explore-skeleton";
import { EmptyExploreState } from "@/components/ui/empty-explore-page";
import { MobilePagination } from "@/components/ui/pagination-mobile";

import Header from "@/components/ui/header";
import { BlogListPage } from "./blogPost/BlogListPage";
const ExplorePage = () => {
  const { user, loading } = useAuthContext();
  const { data: shops, isLoading: shopsLoading } = useAllShops();
  const { data: artists, isLoading: artistsLoading } = useCustomerArtists();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("posts");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#E288F9]" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  const filteredShops =
    shops?.filter((shop) =>
      [shop.name, shop.description, shop.address].some((field) =>
        field?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    ) || [];

  const filteredArtists =
    artists?.filter((artist) =>
      [artist.profile?.fullName, artist.address].some((field) =>
        field?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    ) || [];

  const isLoading = activeTab === "shops" ? shopsLoading : artistsLoading;

  return (
    <div>
      <div className="bg-slate-50/50 min-h-screen pb-24">
        <Header title="Nailify" hasNotification={true} />
        <div className="bg-white px-6 pt-8 pb-6 rounded-b-[3rem] shadow-sm">
          <div className="flex items-center gap-2 text-[#950101] mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Discover
            </span>
          </div>
          <h1 className="text-3xl font-black text-black tracking-tight">
            Find your {""}
            <span
              className="italic text-[#950101]"
              style={{
                textShadow: "2px 2px 0px #FFCFE9",
              }}
            >
              Vibe
            </span>
          </h1>

          {activeTab !== "posts" && (
            <div className="relative group mt-4">
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
          )}
        </div>

        <div className="p-4 space-y-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 h-14 p-1.5 bg-white rounded-[1.5rem] shadow-sm mb-6 border border-slate-100">
              <TabsTrigger
                value="posts"
                className="rounded-xl font-bold data-[state=active]:bg-[#950101] data-[state=active]:text-white transition-all"
              >
                <User className="w-4 h-4 mr-2" />
                Posts
              </TabsTrigger>
              <TabsTrigger
                value="shops"
                className="rounded-xl font-bold data-[state=active]:bg-[#D81B60] data-[state=active]:text-white transition-all"
              >
                <Store className="w-4 h-4 mr-2" />
                Salons
              </TabsTrigger>
              <TabsTrigger
                value="artists"
                className="rounded-xl font-bold data-[state=active]:bg-[#FFCFE9] data-[state=active]:text-white transition-all"
              >
                <User className="w-4 h-4 mr-2" />
                Artists
              </TabsTrigger>
            </TabsList>

            <div className="px-1">
              <TabsContent value="posts" className="m-0 space-y-4">
                {isLoading ? <ExploreSkeleton /> : <BlogListPage />}
              </TabsContent>

              <TabsContent value="shops" className="m-0 space-y-4">
                {isLoading ? (
                  <ExploreSkeleton />
                ) : filteredShops.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      {filteredShops
                        .slice(
                          (currentPage - 1) * pageSize,
                          currentPage * pageSize,
                        )
                        .map((shop) => (
                          <ShopCard key={shop.id} shop={shop} />
                        ))}
                    </div>

                    {/* Pagination for shops */}
                    {filteredShops.length > pageSize && (
                      <div className="pt-6 mt-6 border-t border-slate-100">
                        <MobilePagination
                          currentPage={currentPage}
                          totalPages={Math.ceil(
                            filteredShops.length / pageSize,
                          )}
                          onPageChange={handlePageChange}
                          totalItems={filteredShops.length}
                          visibleItems={Math.min(
                            pageSize,
                            filteredShops.length - (currentPage - 1) * pageSize,
                          )}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <EmptyExploreState query={searchQuery} type="shops" />
                )}
              </TabsContent>

              <TabsContent value="artists" className="m-0 space-y-4">
                {isLoading ? (
                  <ExploreSkeleton />
                ) : filteredArtists.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      {filteredArtists
                        .slice(
                          (currentPage - 1) * pageSize,
                          currentPage * pageSize,
                        )
                        .map((artist) => (
                          <NailArtistCard key={artist.id} artist={artist} />
                        ))}
                    </div>

                    {/* Pagination for artists */}
                    {filteredArtists.length > pageSize && (
                      <div className="pt-6 mt-6 border-t border-slate-100">
                        <MobilePagination
                          currentPage={currentPage}
                          totalPages={Math.ceil(
                            filteredArtists.length / pageSize,
                          )}
                          onPageChange={handlePageChange}
                          totalItems={filteredArtists.length}
                          visibleItems={Math.min(
                            pageSize,
                            filteredArtists.length -
                              (currentPage - 1) * pageSize,
                          )}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <EmptyExploreState query={searchQuery} type="artists" />
                )}
              </TabsContent>
            </div>
          </Tabs>

          <div className="py-4 border-t border-slate-200/60 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {filteredShops.length} Salons • {filteredArtists.length} Artists
              near you
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
