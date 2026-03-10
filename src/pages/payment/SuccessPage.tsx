"use client";
import { CheckCircle2, Calendar, ArrowRight, Home, Loader2, XCircle, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkoutAPI } from "@/services/api";
import Header from "@/components/ui/header";

export const SuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderCode = searchParams.get("orderCode");
  const status = searchParams.get("status");

  useEffect(() => {
    const processSuccessPayment = async () => {
      // Don't process if no order code or payment not successful
      if (!orderCode || status !== "PAID") {
        setIsProcessing(false);
        return;
      }

      try {
        console.log(`Processing success payment for order: ${orderCode}`);
        await checkoutAPI.updateSuccessInvoice(parseInt(orderCode));
        console.log("Invoice updated successfully");
        setError(null);
      } catch (err) {
        console.error("Failed to update invoice:", err);
        setError("Không thể cập nhật hóa đơn. Vui lòng liên hệ hỗ trợ.");
      } finally {
        setIsProcessing(false);
      }
    };

    processSuccessPayment();
  }, [orderCode, status]);

  // Show loading state while processing
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-white">
        <Header title="Nailify" />
        <div className="px-6 pt-32 flex flex-col items-center text-center">
          <div className="relative mb-8">
            <div className="bg-emerald-100 p-6 rounded-full">
              <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
            </div>
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-3">
            Đang xử lý thanh toán
          </h1>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 max-w-sm">
            <p className="text-amber-800 font-medium">
              <TriangleAlert className="h-5 w-5" />
              Vui lòng không chuyển trang
            </p>
            <p className="text-amber-600 text-sm mt-1">
              Chúng tôi đang kích hoạt gói đăng ký của bạn...
            </p>
          </div>

          <div className="w-full max-w-sm">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if something went wrong
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header title="Nailify" />
        <div className="px-6 pt-16 flex flex-col items-center text-center">
          <div className="relative mb-8">
            <div className="bg-red-100 p-6 rounded-full">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-3">
            Có lỗi xảy ra
          </h1>

          <p className="text-slate-600 mb-8">{error}</p>

          <Button
            onClick={() => navigate("/")}
            className="w-full h-14 rounded-full bg-slate-900 text-white font-black uppercase text-xs tracking-widest"
          >
            <Home className="mr-2 w-4 h-4" />
            Trở về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  // Show success state (your original UI)
  return (
    <div className="min-h-screen bg-white">
      <Header title="Nailify" />

      <div className="px-6 pt-16 flex flex-col items-center text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-emerald-100 rounded-full scale-150 animate-ping opacity-20" />
          <div className="relative bg-emerald-500 p-6 rounded-full shadow-xl shadow-emerald-200">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
          Thanh toán thành công!
        </h1>

        {orderCode && (
          <p className="text-sm text-slate-500 mb-2">
            Mã đơn hàng: {orderCode}
          </p>
        )}

        <div className="w-full bg-slate-50 rounded-[2.5rem] p-6 mb-10 border border-slate-100">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200/50">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl shadow-sm">
                <Calendar className="w-5 h-5 text-[#950101]" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Trạng thái
                </p>
                <p className="text-sm font-black text-slate-900">
                  Gói đăng ký đã được kích hoạt
                </p>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-bold italic">
            Một hóa đơn đã được gửi tới email của bạn
          </p>
        </div>

        <div className="w-full space-y-3">
          <Button
            onClick={() => navigate("/my-subscription")}
            className="w-full h-14 rounded-full bg-slate-900 text-white font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all"
          >
            Xem gói đăng ký của tôi
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="w-full h-14 rounded-full text-slate-400 font-black uppercase text-xs tracking-widest"
          >
            <Home className="mr-2 w-4 h-4" />
            Trở về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;