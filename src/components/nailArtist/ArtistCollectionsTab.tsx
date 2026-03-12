import { Plus, Loader2, Sparkles } from "lucide-react";
import CollectionCard from "@/components/collection/CollectionCard";
import { useNavigate } from "react-router-dom";

interface ArtistCollectionsTabProps {
  collections: any[];
  isLoading: boolean;
  onDelete: (id: string) => Promise<void>;
}

export const ArtistCollectionsTab = ({
  collections,
  isLoading,
  onDelete,
}: ArtistCollectionsTabProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#E288F9]" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/my-artist/collections/create")}
            className="group relative aspect-[4/5] rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 hover:border-[#E288F9] hover:bg-purple-50/30 transition-all active:scale-95"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-[#E288F9] transition-colors">
              <Plus className="w-6 h-6 text-slate-400 group-hover:text-white" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-[#E288F9]">
              Thêm set Nail
            </span>
          </button>

          {collections?.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              showActions
              onEdit={() =>
                navigate(`/my-artist/collections/edit/${collection.id}`)
              }
              onDelete={() => onDelete(collection.id)}
            />
          ))}
        </div>
      )}

      {/* Empty State Footer */}
      {!isLoading && collections?.length === 0 && (
        <div className="text-center py-10">
          <p className="text-slate-400 text-xs font-black uppercase">
            Trang set Nail hiện đang trống
          </p>
        </div>
      )}
    </div>
  );
};
