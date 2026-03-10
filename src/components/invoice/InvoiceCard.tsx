import { Invoice } from "@/types/database";
import { ChevronRight, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InvoiceStatusBadge } from "../badge/InvoiceStatusBadge";
export const InvoiceCard = ({ invoice }: { invoice: Invoice }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/invoices/${invoice.id}`)}
      className="bg-white border-2 border-slate-50 rounded-[2rem] p-5 active:scale-[0.98] transition-all shadow-sm flex flex-col gap-4"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
            <Receipt className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              #{invoice.orderCode}
            </p>
            <p className="text-xs font-bold text-slate-900">
              {new Date(invoice.issuedAt).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>
        <InvoiceStatusBadge status={invoice.status} />
      </div>

      <div className="flex justify-between items-end pt-2 border-t border-slate-50">
        <div>
          <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest">
            Tổng thanh toán
          </p>
          <p className="text-xl font-black text-slate-900 leading-none">
            {Number(invoice.totalAmount).toLocaleString()}{" "}
            <span className="text-[10px]">đ</span>
          </p>
        </div>
        <div className="bg-slate-900 p-2 rounded-lg">
          <ChevronRight className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
};
