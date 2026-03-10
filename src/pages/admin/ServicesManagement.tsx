import { useState } from "react";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import ServiceFilter from "@/components/admin/service/ServiceFilter";
import ServiceList from "@/components/admin/service/ServiceList";
import { ServiceItemFilterDto } from "@/types/filter";
import ServiceDetailModal from "@/components/admin/service/ServiceDetailModal";

const ServicesManagement = () => {
  const { user, loading } = useAuthContext();
  const [filters, setFilters] = useState<ServiceItemFilterDto>({});
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null,
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user?.role !== 2) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
            Quản lý <span className="text-[#950101]">Dịch vụ</span>
          </h1>
          <p className="text-sm font-bold text-slate-400 italic mt-1">
            Thiết lập và điều chỉnh danh mục dịch vụ hệ thống
          </p>
        </div>
      </div>

      <div className="mb-6">
        <ServiceFilter filters={filters} onFilterChange={setFilters} />
      </div>

      <div>
        <ServiceList filters={filters} onServiceSelect={setSelectedServiceId} />
      </div>

      {selectedServiceId && (
        <ServiceDetailModal
          serviceId={selectedServiceId}
          open={!!selectedServiceId}
          onClose={() => setSelectedServiceId(null)}
          onServiceUpdated={() => {
            setSelectedServiceId(null);
          }}
        />
      )}
    </div>
  );
};

export default ServicesManagement;
