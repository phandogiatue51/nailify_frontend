import { useState } from "react";
import { Collection } from "@/types/database";
import { collectionAPI } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Layers,
  ChevronDown,
  ChevronUp,
  Tag,
  Building,
  User,
  Image as ImageIcon,
  Clock,
  DollarSign,
} from "lucide-react";

interface CollectionPreviewProps {
  shopId?: string;
  artistId?: string;
  compact?: boolean;
  title?: string;
}

export const CollectionPreview = ({
  shopId,
  artistId,
  compact = false,
  title = "Collections",
}: CollectionPreviewProps) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const loadCollections = async () => {
    if (collections.length > 0) return;

    setLoading(true);
    try {
      const filterParams: any = {};

      if (shopId) filterParams.ShopId = shopId;
      if (artistId) filterParams.ArtistId = artistId;

      const data = await collectionAPI.adminFilter(filterParams);
      setCollections(data);
    } catch (error) {
      console.error("Error loading collections:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = () => {
    if (!expanded && collections.length === 0) {
      loadCollections();
    }
    setExpanded(!expanded);
  };

  if (compact) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={toggleExpand}
          className="w-full justify-between hover:bg-slate-50 rounded-2xl p-6 h-auto border border-slate-100 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-slate-900 rounded-xl text-white">
              <Layers className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#950101] leading-none mb-1">
                Lookbook
              </p>
              <span className="font-black uppercase text-sm tracking-tight text-slate-900">
                {title} ({collections.length})
              </span>
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-slate-300" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-300" />
          )}
        </Button>

        {expanded && (
          <div className="pl-4 space-y-3 animate-in slide-in-from-top-2 duration-300">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto text-slate-300" />
            ) : collections.length > 0 ? (
              collections.slice(0, 3).map((collection) => (
                <div
                  key={collection.id}
                  className="flex justify-between items-center bg-white p-3 rounded-2xl border border-slate-50 shadow-sm"
                >
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-tight truncate pr-4">
                    {collection.name}
                  </span>
                  <Badge
                    className={`text-[9px] font-black uppercase tracking-widest ${collection.isActive ? "bg-emerald-500" : "bg-slate-200 text-slate-500"}`}
                  >
                    {collection.isActive ? "Live" : "Off"}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-[10px] font-bold text-slate-400 uppercase italic pl-4">
                No Collections
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  // Full view (for modal/detail page)
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end px-2">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#950101] mb-2">
            Editor's Choice
          </h3>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 flex items-center gap-3">
            {title} <span className="text-slate-300">/</span>{" "}
            {collections.length}
          </h2>
        </div>
        <Button
          variant="link"
          className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#950101]"
          onClick={toggleExpand}
        >
          {expanded ? "Thu gọn" : "Xem tất cả"}
        </Button>
      </div>

      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-500">
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#950101]" />
            </div>
          ) : collections.length > 0 ? (
            collections.map((collection) => (
              <Card
                key={collection.id}
                className="overflow-hidden rounded-[2.5rem] border-2 border-slate-50 shadow-none hover:border-[#950101]/20 transition-all group"
              >
                <div className="flex flex-col">
                  {/* Fixed Image section with clean gradient fallback */}
                  <div className="h-40 bg-slate-100 relative overflow-hidden">
                    {collection.imageUrl ? (
                      <img
                        src={collection.imageUrl}
                        alt={collection.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#950101] to-[#FFCFE9] opacity-40" />
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 backdrop-blur-md text-slate-900 text-[9px] font-black uppercase tracking-widest border-none">
                        {collection.isActive ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="space-y-1">
                      <h4 className="font-black uppercase text-lg tracking-tight text-slate-900 group-hover:text-[#950101] transition-colors">
                        {collection.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium italic line-clamp-2 leading-relaxed">
                        {collection.description ||
                          "Collection curated specifically for premium nail experiences."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-[#950101]">
                          <span className="text-[10px] font-black">đ</span>
                          <span className="text-md font-black italic">
                            {collection.totalPrice
                              ? collection.totalPrice.toLocaleString()
                              : "Contact"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span className="text-[10px] font-bold uppercase">
                            {collection.estimatedDuration ??
                              collection.calculatedDuration}
                            {" phút"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {collection.tags && collection.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {collection.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag.id}
                            className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-lg"
                          >
                            # {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full p-12 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic">
                Collection is empty
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
