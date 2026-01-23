import { Collection } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
        "overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.98]",
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
        <Badge className="absolute top-2 right-2">
          {itemCount} items
        </Badge>

      </div>
      <CardContent className="p-3">
        <h3 className="font-semibold truncate">{collection.name}</h3>
        {collection.description && (
          <p className="text-sm text-muted-foreground truncate mt-1">
            {collection.description}
          </p>
        )}
        <p className="text-primary font-bold text-lg mt-2">
          ${(collection.totalPrice || 0).toFixed(2)}
        </p>
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
