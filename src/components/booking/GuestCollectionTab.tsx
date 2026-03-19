import CollectionCard from "@/components/collection/CollectionCard";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface GuestCollectionTabProps {
  collections: any[];
  isLoading: boolean;
  onSelect: (collection: any) => void;
  activeFilterCount: number;
}

const GuestCollectionTab = ({
  collections,
  isLoading,
  onSelect,
  activeFilterCount,
}: GuestCollectionTabProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#E288F9]" />
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-slate-500">
            {activeFilterCount > 0
              ? "Không có set nail phù hợp"
              : "Không có set nail"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {collections.map((collection) => (
        <div
          key={collection.id}
          className="cursor-pointer transform active:scale-95 transition-transform"
          onClick={() => onSelect(collection)}
        >
          <CollectionCard collection={collection} />
        </div>
      ))}
    </div>
  );
};

export default GuestCollectionTab;
