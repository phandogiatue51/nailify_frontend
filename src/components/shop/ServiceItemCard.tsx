import { ServiceItem } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { ComponentBadge } from "../badge/ComponentBadge";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ServiceItemCardProps {
  item: ServiceItem;
  selected?: boolean;
  onSelect?: (item: ServiceItem) => void;
  showActions?: boolean;
  onEdit?: (item: ServiceItem) => void;
  onDelete?: (item: ServiceItem) => void;
}

const ServiceItemCard: React.FC<ServiceItemCardProps> = ({
  item,
  selected = false,
  onSelect,
  showActions = false,
  onEdit,
  onDelete,
}) => {
  return (
    <Card
      className={cn(
        "overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md",
        selected && "ring-2 ring-primary ring-offset-2",
        onSelect && "active:scale-[0.98]",
      )}
      onClick={() => onSelect?.(item)}
    >
      <div className="relative aspect-[4/3] bg-muted">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
        {selected && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-primary-foreground" />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <ComponentBadge role={item.componentType} />
        </div>
      </div>

      <CardContent className="p-3">
        <h3 className="font-semibold truncate">{item.name}</h3>

        {item.estimatedDuration && (
          <p className="text-sm text-muted-foreground truncate mt-1">
            {item.estimatedDuration} minutes
          </p>
        )}

        <div className="flex justify-end mt-2">
          <p className="text-green-600 font-bold whitespace-nowrap">
            {Number(item.price).toLocaleString()} VND
          </p>
        </div>

        {showActions && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(item);
              }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(item);
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

export default ServiceItemCard;
