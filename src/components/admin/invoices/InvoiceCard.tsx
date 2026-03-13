// components/admin/invoices/InvoiceCard.tsx
import { useNavigate } from "react-router-dom";
import { Invoice } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Receipt, Calendar, Hash, Banknote } from "lucide-react";
import { InvoiceStatusBadge } from "@/components/badge/InvoiceStatusBadge";

interface InvoiceCardProps {
  invoice: Invoice;
}

export const InvoiceCard = ({ invoice }: InvoiceCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="group relative overflow-hidden border-2 border-slate-100 rounded-[2.5rem] transition-all duration-500 hover:border-[#950101] hover:shadow-2xl hover:shadow-[#950101]/10 bg-white flex flex-col h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex-1">
          <div className="flex justify-center items-start gap-2 mb-4">
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none group-hover:text-[#950101] transition-colors line-clamp-1">
              Hóa đơn #{invoice.orderCode}
            </h3>
          </div>
          <div className="flex justify-center items-start gap-2 mb-4">
            <InvoiceStatusBadge status={invoice.status} />
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-50 p-1.5 rounded-lg">
                <Banknote className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <span className="text-sm font-black text-slate-700 tracking-tight">
                {Number(invoice.totalAmount).toLocaleString()}{" "}
                <span className="text-[10px]">đ</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-blue-50 p-1.5 rounded-lg">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <span className="text-sm font-black text-slate-700 tracking-tight uppercase">
                {new Date(invoice.issuedAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="space-y-4 pt-4 border-t border-slate-50">
          <Button
            variant="ghost"
            className="w-full rounded-2xl font-black uppercase tracking-widest text-[10px] h-11 text-[#950101] hover:text-[#950101] hover:bg-red-50 transition-all border border-transparent hover:border-red-100 shadow-md"
            onClick={() => navigate(`/admin/invoices/${invoice.id}`)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Xem chi tiết hóa đơn
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceCard;
