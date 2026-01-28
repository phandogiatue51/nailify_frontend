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
        "overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.98] h-[290px]",
      )}
      onClick={() => {
        onClick?.(collection);
        onSelect?.();
      }}
    >
      <div className="relative aspect-[4/3] bg-muted">
        {collection.imageUrl ? (
          <img
            src={collection.imageUrl}
            alt={collection.name}
            className="w-full h-full object-cover"
          />
        ) : collection.items && collection.items.length > 0 ? (
          <div className="w-full h-full grid grid-cols-2 gap-0.5 p-0.5">
            {collection.items?.slice(0, 4).map((item, index) => (
              <div
                key={item.id || `item-${index}`}
                className="bg-muted-foreground/10"
              >
                {item.serviceItemImageUrl ? (
                  <img
                    src={item.serviceItemImageUrl}
                    alt={item.serviceItemName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No items
          </div>
        )}
        <Badge className="absolute top-2 right-2">{itemCount} items</Badge>
      </div>

      <CardContent className="p-3">
        <h3 className="font-semibold truncate">{collection.name}</h3>
        {collection.estimatedDuration ? (
          <p className="text-sm text-muted-foreground truncate mt-1">
            {collection.estimatedDuration} minutes
          </p>
        ) : collection.calculatedDuration > 0 ? (
          <p className="text-sm text-muted-foreground truncate mt-1">
            {collection.calculatedDuration} minutes
          </p>
        ) : null}

        <div className="flex justify-end mt-2">
          <p className="text-green-600 font-bold whitespace-nowrap">
            {(collection.totalPrice || 0).toFixed(3)} VND
          </p>
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
        {showActions && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(collection);
              }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(collection);
              }}
              className="text-xs text-destructive hover:text-destructive/80"
            >
              Delete
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CollectionCard;
