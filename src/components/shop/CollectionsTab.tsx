import CollectionCard from "@/components/collection/CollectionCard";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Loader2, Plus } from "lucide-react";
import { EmptyTabState } from "../ui/EmptyTabState";
export const CollectionsTab = ({ collections, isLoading, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Button
        onClick={() => navigate("/my-shop/collections/create")}
        className="w-full h-14 rounded-[1.5rem] bg-gradient-to-r from-[#FFC988] to-[#E288F9] text-white font-black border-none shadow-lg shadow-purple-100 active:scale-95 transition-all"
      >
        <Plus className="w-5 h-5 mr-2" />
        CREATE NEW COLLECTION
      </Button>

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
