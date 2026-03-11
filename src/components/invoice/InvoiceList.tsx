import { useState, useEffect } from "react";
import { Invoice } from "@/types/database";
import { InvoiceFilterDto } from "@/types/filter";
import { invoiceAPI } from "@/services/api";
import { InvoiceCard } from "./InvoiceCard";
import { Loader2, ReceiptText, SearchX } from "lucide-react";

interface InvoiceListProps {
  filters: InvoiceFilterDto;
  isAdmin?: boolean;
}

export const InvoiceList = ({ filters }: InvoiceListProps) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoices = async () => {
      setLoading(true);
      try {
        const api = invoiceAPI.authFilter;
        const data = await api(filters);
        setInvoices(data);
      } catch (error) {
        console.error("Error loading invoices:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, [filters]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#950101]" />
        
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
          <SearchX className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-sm font-black uppercase text-slate-900">
          Không tìm thấy hóa đơn
        </h3>
        <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-tight">
          Vui lòng kiểm tra lại bộ lọc của bạn
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Result Meta */}
      <div className="flex items-center justify-between px-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Kết quả:{" "}
          <span className="text-slate-900">{invoices.length} Hóa đơn</span>
        </p>
      </div>

      {/* Vertical Stack for Mobile */}
      <div className="flex flex-col gap-4">
        {invoices.map((invoice) => (
          <InvoiceCard key={invoice.id} invoice={invoice} />
        ))}
      </div>
    </div>
  );
};
