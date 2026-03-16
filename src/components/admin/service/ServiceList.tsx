import { useState, useEffect } from "react";
import { ServiceItem } from "@/types/database";
import { ServiceItemFilterDto } from "@/types/filter";
import { serviceItemAPI } from "@/services/api";
import { PaginationWrapper } from "@/components/ui/PaginationWrapper";
import ServiceCard from "./ServiceCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, Package } from "lucide-react";

interface ServiceListProps {
  filters: ServiceItemFilterDto;
  onServiceSelect: (serviceId: string) => void;
  onServicesUpdated?: () => void;
}

export const ServiceList = ({
  filters,
  onServiceSelect,
  onServicesUpdated,
}: ServiceListProps) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const loadServices = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await serviceItemAPI.adminFilter(filters);
      setServices(data);
    } catch (err) {
      setError("Failed to load services");
      console.error("Error loading services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
    setPage(1); // Reset to page 1 when filters change
  }, [filters]);

  const handleServicesUpdated = () => {
    loadServices(); // Refresh the list
    onServicesUpdated?.();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={loadServices}
            className="ml-4"
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <Package className="w-12 h-12 mx-auto text-slate-300" />
        <div className="space-y-1">
          <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Dịch vụ chưa sẵn sàng</h3>
          <p className="text-sm font-medium text-slate-400">
            {Object.keys(filters).length > 0
              ? "Hãy thử thay đổi yêu cầu để tìm thấy gói dịch vụ phù hợp."
              : "Studio đang chuẩn bị cập nhật danh mục dịch vụ mới."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <PaginationWrapper
      items={services}
      currentPage={page}
      pageSize={12}
      onPageChange={setPage}
      renderItem={(service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onViewDetails={() => onServiceSelect(service.id)}
          onServiceUpdated={handleServicesUpdated}
        />
      )}
      gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    />
  );
};

export default ServiceList;
