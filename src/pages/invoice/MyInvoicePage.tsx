import { useState } from "react";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import { Loader2, ArrowLeft, Receipt } from "lucide-react";
import { InvoiceList } from "@/components/invoice/InvoiceList";
import { InvoiceFilter } from "@/components/invoice/InvoiceFilter";
import { InvoiceFilterDto } from "@/types/filter";
import { useNavigate } from "react-router-dom";
const MyInvoicePage = () => {
  const { user, loading } = useAuthContext();
  const [filters, setFilters] = useState<InvoiceFilterDto>({});
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#950101]" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Đang tải lịch sử...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-900" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#950101] rounded-2xl flex items-center justify-center shadow-lg shadow-[#950101]/20 shrink-0">
            <Receipt className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase leading-none">
              Hóa đơn <span className="text-[#950101]">của tôi</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Lịch sử thanh toán gói dịch vụ
            </p>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-8">
        <section className="animate-in fade-in slide-in-from-top-4 duration-500">
          <InvoiceFilter filters={filters} onFilterChange={setFilters} />
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
          <InvoiceList filters={filters} />
        </section>
      </main>
    </div>
  );
};

export default MyInvoicePage;
