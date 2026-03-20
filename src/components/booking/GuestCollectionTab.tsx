import CollectionCard from "@/components/collection/CollectionCard";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GuestCollectionTabProps {
  collections: any[];
  isLoading: boolean;
  onSelect: (collection: any) => void;
  activeFilterCount: number;
  selectedCollectionId?: string;
}

const GuestCollectionTab = ({
  collections,
  isLoading,
  onSelect,
  activeFilterCount,
  selectedCollectionId,
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
          className={cn(
            "cursor-pointer transform active:scale-95 transition-all",
            selectedCollectionId === collection.id && "ring-2 ring-[#E288F9] ring-offset-2 rounded-2xl"
          )}
          onClick={() => onSelect(collection)}
        >
          <CollectionCard collection={collection} />
        </div>
      ))}
    </div>
  );
};

export default GuestCollectionTab;