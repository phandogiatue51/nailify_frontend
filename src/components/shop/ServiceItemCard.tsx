import { ServiceItem } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

// Map numeric component types to colors
const componentTypeColors: Record<number, string> = {
  0: "bg-blue-100 text-blue-800",
  1: "bg-green-100 text-green-800",
  2: "bg-purple-100 text-purple-800",
  3: "bg-pink-100 text-pink-800",
  4: "bg-orange-100 text-orange-800",
};

// Map numeric component types to labels
const componentTypeLabels: Record<number, string> = {
  0: "Form",
  1: "Base",
  2: "Shape",
  3: "Polish",
  4: "Design",
};

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
      <div className="relative aspect-square bg-muted">
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
        <Badge
          className={cn(
            "absolute top-2 left-2 text-xs capitalize",
            componentTypeColors[item.componentType],
          )}
        >
          {componentTypeLabels[item.componentType]} {/* Use the label */}
        </Badge>
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-sm truncate">{item.name}</h3>
        <p className="text-primary font-semibold mt-1">
          ${Number(item.price).toFixed(2)}
        </p>
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
