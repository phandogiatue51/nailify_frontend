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
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Services Management</h1>
          <p className="text-muted-foreground">Manage all nail services</p>
        </div>
        <div className="text-sm text-muted-foreground">Admin Dashboard</div>
      </div>

      <ServiceFilter filters={filters} onFilterChange={setFilters} />

      <div className="mt-6">
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
