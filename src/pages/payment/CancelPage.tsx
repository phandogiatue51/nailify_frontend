"use client";
import { XCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { invoiceAPI } from "@/services/api";
import Header from "@/components/ui/header";

export const CancelPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isCancelling, setIsCancelling] = useState(true);
  const orderCode = searchParams.get("orderCode");

  useEffect(() => {
    const cancelInvoice = async () => {
      if (!orderCode) {
        console.log("No order code provided");
        setIsCancelling(false);
        return;
      }

      try {
        await invoiceAPI.cancel(parseInt(orderCode));
        console.log(`Invoice ${orderCode} cancelled successfully`);
      } catch (error) {
        console.error("Failed to cancel invoice:", error);
      } finally {
        setIsCancelling(false);
      }
    };

    cancelInvoice();
  }, [orderCode]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Header title="Nailify" />

      <div className="px-6 pt-20 flex flex-col items-center text-center">
        <div className="bg-white p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white w-full">
          <div className="bg-red-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-4">
            {isCancelling ? "Đang xử lý..." : "Đã hủy hóa đơn"}
          </h1>

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
