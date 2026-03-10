"use client";
import { XCircle, Home, Loader2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { invoiceAPI } from "@/services/api";
import Header from "@/components/ui/header";

export const CancelPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isCancelling, setIsCancelling] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const orderCode = searchParams.get("orderCode");

  useEffect(() => {
    const cancelInvoice = async () => {
      if (!orderCode) {
        console.log("No order code provided");
        setIsCancelling(false);
        return;
      }

      try {
        console.log(`Cancelling invoice ${orderCode}...`);
        await invoiceAPI.cancel(parseInt(orderCode));
        console.log(`Invoice ${orderCode} cancelled successfully`);
        setError(null);
      } catch (error) {
        console.error("Failed to cancel invoice:", error);
        setError("Không thể hủy hóa đơn. Vui lòng thử lại hoặc liên hệ hỗ trợ.");
      } finally {
        setIsCancelling(false);
      }
    };

    cancelInvoice();
  }, [orderCode]);

  // Loading state
  if (isCancelling) {
    return (
      <div className="min-h-screen bg-white">
        <Header title="Nailify" />
        <div className="px-6 pt-32 flex flex-col items-center text-center">
          <div className="relative mb-8">
            <div className="bg-red-50 p-6 rounded-full">
              <Loader2 className="w-12 h-12 text-red-400 animate-spin" />
            </div>
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-3">
            Đang hủy hóa đơn
          </h1>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 max-w-sm">
            <p className="text-amber-800 font-medium">
              <TriangleAlert className="h-5 w-5" />
              Vui lòng không chuyển trang
            </p>
            <p className="text-amber-600 text-sm mt-1">
              Chúng tôi đang cập nhật trạng thái hóa đơn của bạn...
            </p>
          </div>

          {orderCode && (
            <p className="text-sm text-slate-400">
              Mã đơn hàng: {orderCode}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header title="Nailify" />
        <div className="px-6 pt-20 flex flex-col items-center text-center">
          <div className="bg-white p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white w-full">
            <div className="bg-red-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>

            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-4">
              Có lỗi xảy ra
            </h1>

            <p className="text-slate-600 mb-6">{error}</p>

            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full h-12 rounded-2xl border-slate-200 text-slate-600 font-black uppercase text-[10px] tracking-widest"
              >
                Thử lại
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="w-full h-12 rounded-2xl text-slate-400 font-black uppercase text-[10px] tracking-widest"
              >
                <Home className="mr-2 w-3 h-3" />
                Trở về trang chủ
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state (your original UI)
  return (
    <div className="min-h-screen bg-slate-50/50">
      <Header title="Nailify" />

      <div className="px-6 pt-20 flex flex-col items-center text-center">
        <div className="bg-white p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white w-full">
          <div className="bg-red-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            Đã hủy hóa đơn
          </h1>

          {orderCode && (
            <p className="text-sm text-slate-500 mb-6">
              Mã đơn hàng: {orderCode}
            </p>
          )}

          <div>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="h-12 rounded-2xl border-slate-200 text-slate-600 font-black uppercase text-[10px] tracking-widest"
            >
              <Home className="mr-2 w-3 h-3" />
              Trở về trang chủ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelPage;