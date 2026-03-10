// pages/admin/InvoiceDetailPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import { Invoice } from "@/types/database";
import { invoiceAPI } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Phone, Mail } from "lucide-react";
import { InvoiceStatusBadge } from "@/components/badge/InvoiceStatusBadge";
import { SubscriptionTierBadge } from "@/components/badge/SubscriptionTierBadge";
import DateDisplay from "@/components/ui/date-display";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Paid: "bg-green-100 text-green-800",
  Overdue: "bg-red-100 text-red-800",
  Cancelled: "bg-gray-100 text-gray-800",
};

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthContext();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoice = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await invoiceAPI.getById(id);
        setInvoice(data);
      } catch (error) {
        console.error("Error loading invoice:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [id]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 2) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <p>Invoice not found</p>
            <Button
              className="mt-4"
              onClick={() => navigate("/admin/invoices")}
            >
              Back to Invoices
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Back Action */}
      <Button
        variant="ghost"
        className="mb-6 hover:bg-[#950101]/5 text-slate-400 hover:text-[#950101] font-bold uppercase tracking-widest text-[10px] transition-all"
        onClick={() => navigate("/admin/invoices")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại danh sách
      </Button>

      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
        {/* Decorative Header Bar */}
        <div className="h-2 w-full bg-[#950101]" />

        <CardHeader className="px-10 pt-10 pb-6 border-b border-slate-50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#950101] mb-1">
                Chi tiết hóa đơn
              </p>
              <CardTitle className="text-3xl font-black tracking-tighter text-slate-900">
                INVOICE{" "}
                <span className="text-slate-400">#{invoice.orderCode}</span>
              </CardTitle>
            </div>
            <InvoiceStatusBadge status={invoice.status} />
          </div>
        </CardHeader>

        <CardContent className="px-10 py-8 space-y-12">
          {/* Grid: Customer & Subscription Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column: Customer Details */}
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 border-b pb-2">
                Khách hàng
              </h3>
              <div className="space-y-3">
                <p className="text-lg font-black text-slate-800 leading-none">
                  {invoice.fullName || "N/A"}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <Mail className="w-3.5 h-3.5 text-[#950101]" />
                  {invoice.email || "N/A"}
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <Phone className="w-3.5 h-3.5 text-[#950101]" />
                  {invoice.phone || "N/A"}
                </div>
              </div>
            </section>

            {/* Right Column: Plan Details */}
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 border-b pb-2">
                Gói dịch vụ
              </h3>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <SubscriptionTierBadge
                    planId={invoice.subscriptionPlanId}
                    size="md"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <DateDisplay dateString={invoice.startDate} label="Bắt đầu" />
                  <DateDisplay dateString={invoice.endDate} label="Kết thúc" />
                </div>
              </div>
            </section>
          </div>

          {/* Payment Summary Table Style */}
          <section className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
              Chi tiết thanh toán
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500 uppercase tracking-tight">
                  Tổng cộng (Total)
                </span>
                <span className="text-xl font-black text-slate-900">
                  {Number(invoice.totalAmount).toLocaleString()} VNĐ
                </span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-4">
                <span className="font-bold text-slate-500 uppercase tracking-tight text-[#950101]">
                  Đã thanh toán (Paid)
                </span>
                <span className="text-xl font-black text-[#950101]">
                  -{Number(invoice.amountPaid).toLocaleString()} VNĐ
                </span>
              </div>

              {/* Timeline Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <DateDisplay
                  dateString={invoice.issuedAt}
                  label="Ngày tạo"
                  showTime
                />
                <DateDisplay
                  dateString={invoice.dueDate}
                  label="Hạn thanh toán"
                  showTime
                />
                <DateDisplay
                  dateString={invoice.paidAt}
                  label="Ngày thanh toán"
                  showTime
                />
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceDetail;
