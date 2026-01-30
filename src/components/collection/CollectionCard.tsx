import { Collection } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TagBadge } from "../badge/TagBadge";

interface CollectionCardProps {
  collection: Collection;
  onClick?: (collection: Collection) => void;
  onSelect?: () => void;
  showActions?: boolean;
  onEdit?: (collection: Collection) => void;
  onDelete?: (collection: Collection) => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  onClick,
  onSelect,
  showActions = false,
  onEdit,
  onDelete,
}) => {
  const itemCount = collection.items?.length || 0;

  return (
    <Card
      className={cn(
        "group overflow-hidden cursor-pointer transition-all duration-300 border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-[2rem] h-auto pb-2",
      )}
      onClick={() => {
        onClick?.(collection);
        onSelect?.();
      }}
    >
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        {collection.imageUrl ? (
          <img
            src={collection.imageUrl}
            alt={collection.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full grid grid-cols-2 gap-1 p-1">
            {collection.items?.slice(0, 4).map((item, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden">
                {item.serviceItemImageUrl ? (
                  <img
                    src={item.serviceItemImageUrl}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100" />
                )}
              </div>
            ))}
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none text-[10px] font-bold px-2 rounded-lg">
            {itemCount} ITEMS
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-bold text-slate-800 text-sm truncate">
          {collection.name}
        </h3>

        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            ~{collection.calculatedDuration || collection.estimatedDuration}{" "}
            MINS
          </span>
          <span className="text-sm font-black text-[#FFC988]">
            {Number(collection.totalPrice).toLocaleString()}đ
          </span>
        </div>

        {collection.tags && collection.tags.length > 0 && (
          <div className="mt-2">
            <div className="flex flex-wrap gap-1">
              {collection.tags.slice(0, 3).map((tag) => (
                <TagBadge key={tag.id} tag={tag} size="sm" />
              ))}

              {collection.tags.length > 3 && (
                <span className="text-xs text-muted-foreground self-center">
                  +{collection.tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CollectionCard;
