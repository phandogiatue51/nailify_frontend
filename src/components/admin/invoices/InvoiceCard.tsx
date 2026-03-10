// components/admin/invoices/InvoiceCard.tsx
import { useNavigate } from "react-router-dom";
import { Invoice } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Receipt } from "lucide-react";
import { InvoiceStatusBadge } from "@/components/badge/InvoiceStatusBadge";

interface InvoiceCardProps {
  invoice: Invoice;
}

export const InvoiceCard = ({ invoice }: InvoiceCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="group relative overflow-hidden border-2 border-slate-100 rounded-[2.5rem] transition-all duration-500 hover:border-[#950101] hover:shadow-2xl hover:shadow-[#950101]/10 hover:-translate-y-1">
      <CardContent className="p-8">
        {/* Top Row: Identity */}
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-[#950101]/5 transition-colors">
            <Receipt className="w-6 h-6 text-slate-400 group-hover:text-[#950101]" />
          </div>
          <InvoiceStatusBadge status={invoice.status} />
        </div>

        {/* Amount: High Impact Typography */}
        <div className="mb-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Total Amount
          </p>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {Number(invoice.totalAmount).toLocaleString()}{" "}
            <span className="text-sm font-bold text-slate-400">VNĐ</span>
          </h3>
        </div>

        {/* Meta Info */}
        <div className="grid grid-cols-2 gap-4 mb-6 border-y border-slate-50 py-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Order Code
            </p>
            <p className="text-sm font-black text-slate-700">
              #{invoice.orderCode}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Issued At
            </p>
            <p className="text-sm font-medium text-slate-600">
              {new Date(invoice.issuedAt).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        <Button
          className="w-full bg-slate-900 hover:bg-[#950101] text-white font-bold uppercase tracking-widest text-xs h-12 rounded-2xl transition-all"
          onClick={() => navigate(`/admin/invoices/${invoice.id}`)}
        >
          <Eye className="w-4 h-4 mr-2" /> Detail View
        </Button>
      </CardContent>

      {/* Subtle Brand Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#950101]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </Card>
  );
};
