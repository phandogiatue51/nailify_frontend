import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { useNailArtist } from "@/hooks/useNailArtist";
import { useNailArtistServiceItems } from "@/hooks/useNailArtistServiceItems";
import { useNailArtistCollections } from "@/hooks/useNailArtistCollections";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Award } from "lucide-react";
import { Edit } from "lucide-react";
import { ArtistCollectionsTab } from "@/components/nailArtist/ArtistCollectionsTab";
import { ArtistServicesTab } from "@/components/nailArtist/ArtistServicesTab";
import { useNavigate } from "react-router-dom";
import Header from "@/components/ui/header";
const MyNailArtistPage = () => {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();
  const { myArtist, artistLoading } = useNailArtist();

  const {
    serviceItems,
    groupedItems,
    isLoading: itemsLoading,
    deleteServiceItem,
  } = useNailArtistServiceItems();

  const {
    collections,
    isLoading: collectionsLoading,
    deleteCollection,
  } = useNailArtistCollections();

  if (loading || artistLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#E288F9]" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (user?.role !== 4) return <Navigate to="/" replace />;

  const handleDeleteItem = async (id: string) => {
    await deleteServiceItem.mutateAsync(id);
  };

  const handleDeleteCollection = async (id: string) => {
    await deleteCollection.mutateAsync(id);
  };

  return (
    <div>
      <Header title="Nailify"/>

      <div className="p-4 space-y-6 bg-slate-50/30 min-h-screen">
        {/* Profile Header */}
        <header className="pt-4 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#FFC988]">
              <Award className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Master Artist
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              {myArtist?.name || "My Portfolio"}
            </h1>
            <p className="text-slate-500 text-sm font-medium italic">
              {myArtist?.bio || "Expert Nail Technician"}
            </p>
          </div>
        </header>

        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12 p-1 bg-slate-200/50 rounded-2xl mb-6">
            <TabsTrigger value="services" className="rounded-xl font-bold">
              Services
            </TabsTrigger>
            <TabsTrigger value="collections" className="rounded-xl font-bold">
              Collections
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <ArtistServicesTab
              groupedItems={groupedItems}
              serviceItems={serviceItems}
              isLoading={itemsLoading}
              onDelete={handleDeleteItem}
            />
          </TabsContent>

          <TabsContent value="collections">
            <ArtistCollectionsTab
              collections={collections}
              isLoading={collectionsLoading}
              onDelete={handleDeleteCollection}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyNailArtistPage;
