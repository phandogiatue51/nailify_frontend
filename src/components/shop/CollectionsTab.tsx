import CollectionCard from "@/components/collection/CollectionCard";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Loader2, Plus } from "lucide-react";
import { EmptyTabState } from "../ui/EmptyTabState";
export const CollectionsTab = ({ collections, isLoading, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-center w-full">
        <Button
          onClick={() => navigate("/my-shop/collections/create")}
          className="w-auto px-10 h-12 text-[11px] tracking-[0.2em] rounded-[1.5rem] bg-gradient-to-r from-[#950101] to-[#D81B60] text-white font-black border-none shadow-xl shadow-[#950101]/20 active:scale-95 transition-all flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-3 stroke-[3px] uppercase" />
          Tạo set Nail
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#FFC988]" />
        </div>
      ) : collections?.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              showActions
              onEdit={() =>
                navigate(`/my-shop/collections/edit/${collection.id}`)
              }
              onDelete={() => onDelete(collection.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyTabState
          title="Empty Lookbook"
          desc="Combine services into trendy pre-set collections."
          onAction={() => navigate("/my-shop/collections/create")}
        />
      )}
    </div>
  );
};
