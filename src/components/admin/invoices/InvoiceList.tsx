// components/admin/invoices/InvoiceList.tsx
import { useState, useEffect } from "react";
import { Invoice } from "@/types/database";
import { InvoiceFilterDto } from "@/types/filter";
import { invoiceAPI } from "@/services/api";
import { InvoiceCard } from "./InvoiceCard";
import { Loader2 } from "lucide-react";

interface InvoiceListProps {
  filters: InvoiceFilterDto;
  isAdmin?: boolean;
}

export const InvoiceList = ({ filters, isAdmin = true }: InvoiceListProps) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoices = async () => {
      setLoading(true);
      try {
        const api = isAdmin ? invoiceAPI.filter : invoiceAPI.authFilter;
        const data = await api(filters);
        setInvoices(data);
      } catch (error) {
        console.error("Error loading invoices:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, [filters, isAdmin]);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No invoices found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {invoices.map((invoice) => (
        <InvoiceCard key={invoice.id} invoice={invoice} />
      ))}
    </div>
  );
};
