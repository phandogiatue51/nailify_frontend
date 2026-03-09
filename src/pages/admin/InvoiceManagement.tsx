// pages/admin/InvoiceManagement.tsx
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { InvoiceList } from "@/components/admin/invoices/InvoiceList";
import InvoiceFilter from "@/components/admin/invoices/InvoiceFilter";
import { InvoiceFilterDto } from "@/types/filter";
import { useState } from "react";

const InvoiceManagement = () => {
  const { user, loading } = useAuthContext();
  const [filters, setFilters] = useState<InvoiceFilterDto>({});

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
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
            Lịch sử <span className="text-[#950101]">Hóa đơn</span>
          </h1>
          <p className="text-sm font-medium text-slate-400 italic mt-1">
            Theo dõi hóa đơn từ các gói đăng ký
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-[#950101]">
              Nailify Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <InvoiceFilter filters={filters} onFilterChange={setFilters} />
      </div>

      {/* Invoice List - Full width now */}
      <InvoiceList filters={filters} isAdmin={true} />
    </div>
  );
};

export default InvoiceManagement;
