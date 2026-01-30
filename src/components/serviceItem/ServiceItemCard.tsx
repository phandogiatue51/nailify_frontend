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
        "group overflow-hidden cursor-pointer transition-all duration-300 border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-[2rem]",
        selected && "ring-2 ring-[#E288F9] ring-offset-2",
        onSelect && "active:scale-[0.96]",
      )}
      onClick={() => onSelect?.(item)}
    >
      <div className="relative aspect-square bg-slate-100 overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Nailify
            </span>
          </div>
        )}

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <ComponentBadge role={item.componentType} />
        </div>

        {selected && (
          <div className="absolute top-3 right-3 w-7 h-7 bg-[#E288F9] rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-1">
        <h3 className="font-bold text-slate-800 text-sm leading-tight truncate">
          {item.name}
        </h3>

        <div className="flex items-center justify-between gap-1 pt-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
            {item.estimatedDuration} MINS
          </p>
          <p className="text-sm font-black text-[#E288F9]">
            {Number(item.price).toLocaleString()}đ
          </p>
        </div>

        {showActions && (
          <div className="flex gap-3 mt-3 pt-2 border-t border-slate-50">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(item);
              }}
              className="text-[10px] font-bold uppercase text-slate-400 hover:text-slate-900"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(item);
              }}
              className="text-[10px] font-bold uppercase text-red-400 hover:text-red-600"
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
