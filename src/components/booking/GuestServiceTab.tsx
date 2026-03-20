import ServiceItemCard from "@/components/serviceItem/ServiceItemCard";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ServiceItem } from "@/types/database";

interface GuestServiceTabProps {
  services: ServiceItem[];
  isLoading: boolean;
  onSelect: (service: ServiceItem) => void;
  activeFilterCount: number;
  selectedItemIds?: string[];
}

const GuestServiceTab = ({
  services,
  isLoading,
  onSelect,
  activeFilterCount,
  selectedItemIds = [],
}: GuestServiceTabProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#E288F9]" />
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-slate-500">
            {activeFilterCount > 0
              ? "Không có dịch vụ lẻ phù hợp"
              : "Không có dịch vụ lẻ"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {services.map((service) => (
        <div
          key={service.id}
          className="cursor-pointer transform active:scale-95 transition-transform"
        >
          <ServiceItemCard 
            item={service} 
            onSelect={onSelect} 
            selected={selectedItemIds.includes(service.id!)}
          />
        </div>
      ))}
    </div>
  );
};

export default GuestServiceTab;
