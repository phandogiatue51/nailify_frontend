import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceItemCard from "@/components/serviceItem/ServiceItemCard";
import { useNavigate } from "react-router-dom";

const COMPONENT_TYPES = [
  { value: 0, label: "Lớp Nền" },
  { value: 1, label: "Tạo Dáng" },
  { value: 2, label: "Sơn Bóng" },
  { value: 3, label: "Trang Trí" },
  { value: 4, label: "Đính Đá" },
];

export const ArtistServicesTab = ({
  serviceItems,
  isLoading,
  onDelete,
}) => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Category Horizontal Scroll */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
        {COMPONENT_TYPES.map((type) => (
          <Button
            key={type.value}
            variant="outline"
            size="sm"
            onClick={() =>
              navigate(`/my-artist/service-items/create/${type.value}`)
            }
            className="rounded-2xl border-slate-100 bg-white shadow-sm hover:border-[#E288F9] px-4 py-5 font-bold text-[11px] uppercase tracking-wider"
          >
            <Plus className="w-3 h-3 mr-2 text-[#E288F9]" />
            {type.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#E288F9]" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {serviceItems?.map((item) => (
            <ServiceItemCard
              key={item.id}
              item={item}
              showActions
              onEdit={() =>
                navigate(`/my-artist/service-items/edit/${item.id}`)
              }
              onDelete={() => onDelete(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
