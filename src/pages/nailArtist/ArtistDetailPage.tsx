import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import {
  useCustomerArtistById,
  useCustomerCollections,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import CollectionCard from "@/components/collection/CollectionCard";
import { useStartConversation } from "@/hooks/useChat";

const ArtistDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuthContext();

  const { data: artist, isLoading: artistLoading } = useCustomerArtistById(id);
  const { data: collections, isLoading: collectionsLoading } =
    useCustomerCollections(undefined, id);
  const startConversation = useStartConversation();

  if (loading || artistLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#E288F9]" />
      </div>
    );
  }

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

  if (!user) return <Navigate to="/auth" replace />;
  if (!artist) return <Navigate to="/explore" replace />;

  return (
    <div className="relative bg-slate-50/30 min-h-screen">
      {/* Artist Hero */}
      <div className="relative h-80">
        <img
          src={artist.avatarUrl || "/placeholder-artist.jpg"}
          className="w-full h-full object-cover"
          alt={artist.fullName}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/10" />

        {/* Back and Share buttons */}
        <div className="absolute top-6 left-4 right-4 flex justify-between">
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

        {/* Artist Info Overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-[#FFC988] text-slate-900 font-black border-none">
              {artist.isVerified ? "VERIFIED ARTIST" : "ARTIST"}
            </Badge>
            <div className="flex items-center gap-1 bg-white/80 backdrop-blur px-2 py-0.5 rounded-full">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-bold">
                {artist.rating?.toFixed(1) || "0.0"}
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">
            {artist.fullName}
          </h1>
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

      <div className="p-4 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black text-slate-900">Portfolio</h2>
        </div>

        <div className="px-4 mt-6 pb-6">
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#950101] to-[#ffcfe9] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-slate-900">
                    Have something specific in mind?
                  </h3>
                  <p className="text-sm text-slate-500">
                    Request a custom design
                  </p>
                </div>
                <Button
                  onClick={() => navigate(`/artist/${id}/custom`)}
                  size="sm"
                  className="font-black tracking-tight uppercase rounded-[2rem]"
                  style={{
                    background:
            "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
                    border: "none",
                  }}
                >
                  Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {collectionsLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#E288F9]" />
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
                <Palette className="w-8 h-8 text-[#E288F9]" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">
                Portfolio coming soon
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                {artist.fullName.split(" ")[0]} is building their portfolio. You
                can still book a custom appointment.
              </p>
              <Button
                onClick={() => navigate(`/artists/${id}/custom`)}
                className="w-full"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Book Custom Appointment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ArtistDetailPage;
