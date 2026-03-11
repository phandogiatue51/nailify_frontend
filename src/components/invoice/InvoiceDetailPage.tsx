import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, Receipt } from "lucide-react";
import { InvoiceStatusBadge } from "../badge/InvoiceStatusBadge";
import { Invoice } from "@/types/database";
import { invoiceAPI } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { SubscriptionTierBadge } from "../badge/SubscriptionTierBadge";
import DateDisplay from "../ui/date-display";
const getById = (id: string) => invoiceAPI.getById(id);

export const InvoiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getById(id)
      .then((res) => setInvoice(res))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">Đang tải hóa đơn...</div>;
  if (!invoice) return <div className="p-6">Không tìm thấy hóa đơn</div>;

  return (
    <div className="p-6 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-900" />
        </button>
      </div>
      <div className="text-center space-y-2 py-4">
        <div className="inline-block p-4 rounded-full bg-slate-50 mb-2">
          <Receipt className="w-8 h-8 text-[#950101]" />
        </div>
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          Hóa đơn điện tử
        </h2>
        <p className="text-4xl font-black text-slate-900 tracking-tighter">
          {Number(invoice.totalAmount).toLocaleString()}{" "}
          <span className="text-lg">đ</span>
        </p>
        <div className="flex justify-center">
          <InvoiceStatusBadge status={invoice.status} />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-6 border-2 border-slate-100 space-y-6 relative shadow-sm">
        {/* Standard Info Rows */}
        <div className="space-y-4">
          {[
            { label: "Mã đơn hàng", value: `#${invoice.orderCode}` },
            {
              label: "Ngày tạo",
              value: new Date(invoice.issuedAt).toLocaleString("vi-VN"),
            },
            {
              label: "Thanh toán lúc",
              value: new Date(invoice.paidAt).toLocaleString("vi-VN"),
            },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.1em]">
                {item.label}
              </span>
              <span className="text-xs font-black text-slate-700">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <section className="p-4 rounded-[1.5rem] bg-slate-50/50 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
              Chi tiết gói
            </h3>
            <SubscriptionTierBadge
              planId={invoice.subscriptionPlanId}
              size="sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                Ngày bắt đầu
              </p>
              <p className="text-[13px] font-black text-slate-700">
                <DateDisplay dateString={invoice.startDate}/>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                Ngày kết thúc
              </p>
              <p className="text-[13px] font-black text-[#950101]">
                <DateDisplay dateString={invoice.endDate}/>
              </p>
            </div>
          </div>
        </section>

        <div className="pt-6 border-t border-dashed border-slate-200">
          <div className="flex justify-between items-center bg-[#950101] p-5 rounded-[1.5rem] shadow-lg shadow-[#950101]/20 text-white">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest block">
                Tổng thanh toán
              </span>
            </div>
            <span className="text-xl font-black">
              {Number(invoice.amountPaid).toLocaleString()} đ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
