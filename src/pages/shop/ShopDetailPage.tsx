import { useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import {
  useCustomerShopById,
  useCustomerServiceItems,
  useCustomerCollections,
} from "@/hooks/useCustomer";
import {
  Share2,
  Loader2,
  ArrowLeft,
  Wand2,
  Sparkles,
  MessageCircle,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CollectionCard from "@/components/collection/CollectionCard";
import { useStartConversation } from "@/hooks/useChat";

const ShopDetailPage = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuthContext();
  const { data: shop, isLoading: shopLoading } = useCustomerShopById(shopId);
  const { data: collections, isLoading: collectionsLoading } =
    useCustomerCollections(shopId);
  const startConversation = useStartConversation();

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
          <div className="w-full h-full bg-gradient-to-br from-[#FFC988] to-[#E288F9]" />
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
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">
                {shop.name}
              </h1>
            </div>
            {shop.logoUrl && (
              <img
                src={shop.logoUrl}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-50 shadow-sm"
              />
            )}
          </div>

          <p className="text-sm text-slate-400 leading-relaxed italic">
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
              background: "linear-gradient(90deg, #FFC988 0%, #f988b3 100%)",
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
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFC988] to-[#E288F9] flex items-center justify-center">
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
                    "linear-gradient(90deg, #FFC988 0%, #f988b3 100%)",
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
      <div className="p-4 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black text-slate-900">Lookbook</h2>
        </div>

        {collectionsLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : collections && collections.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="cursor-pointer"
                onClick={() => navigate(`/collections/${collection.id}`)}
              >
                <CollectionCard collection={collection} />
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[#FFC988]/20 to-[#E288F9]/20 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-[#E288F9]" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">
                No lookbooks yet
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Check back later or create your own custom design.
              </p>
              <Button
                onClick={() => navigate(`/shop/${shopId}/custom`)}
                className="w-full"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Make Your Own Design
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ShopDetailPage;
