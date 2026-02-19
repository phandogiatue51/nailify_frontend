import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceItemCard from "@/components/serviceItem/ServiceItemCard";
import { useNavigate } from "react-router-dom";
import { EmptyTabState } from "../ui/EmptyTabState";

const COMPONENT_TYPES = [
  { value: 0, label: "Base" },
  { value: 1, label: "Shape" },
  { value: 2, label: "Polish" },
  { value: 3, label: "Design" },
  { value: 4, label: "Gem" },
];

export const ServicesTab = ({
  groupedItems,
  serviceItems,
  isLoading,
  onDelete,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Quick Add / Filter Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
        {COMPONENT_TYPES.map((type) => (
          <Button
            key={type.value}
            variant="outline"
            size="sm"
            onClick={() =>
              navigate(`/my-shop/service-items/create/${type.value}`)
            }
            className="rounded-2xl border-slate-100 bg-white shadow-sm hover:border-[#FFC988] whitespace-nowrap px-4 py-5 font-bold text-[11px] uppercase tracking-wider"
          >
            <Plus className="w-3 h-3 mr-2 text-[#FFC988]" />
            {type.label}
            {groupedItems?.[type.value]?.length > 0 && (
              <span className="ml-2 text-[#E288F9] bg-purple-50 px-2 py-0.5 rounded-lg text-[10px]">
                {groupedItems[type.value].length}
              </span>
            )}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#E288F9]" />
        </div>
      ) : serviceItems?.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {serviceItems.map((item) => (
            <ServiceItemCard
              key={item.id}
              item={item}
              showActions
              onEdit={() => navigate(`/my-shop/service-items/edit/${item.id}`)}
              onDelete={() => onDelete(item.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyTabState
          title="No services yet"
          desc="Add your first nail service to start booking."
          onAction={() => navigate("/my-shop/service-items/create/0")}
        />
      )}
    </div>
  );
};
