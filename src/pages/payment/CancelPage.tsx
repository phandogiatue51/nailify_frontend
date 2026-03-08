"use client";
import { XCircle, RefreshCcw, Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/ui/header";

export const CancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Header title="Payment" />

      <div className="px-6 pt-20 flex flex-col items-center text-center">
        <div className="bg-white p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white w-full">
          <div className="bg-red-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            Payment Cancelled
          </h1>

          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl mb-8">
            <AlertCircle className="w-5 h-5 text-slate-300 shrink-0" />
            <p className="text-[11px] text-slate-500 text-left font-bold">
              Need help? Contact our support if you encountered a technical
              issue during checkout.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => window.history.back()}
              className="h-12 rounded-2xl bg-[#950101] text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-[#950101]/20"
            >
              <RefreshCcw className="mr-2 w-3 h-3" />
              Try Again
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="h-12 rounded-2xl border-slate-200 text-slate-600 font-black uppercase text-[10px] tracking-widest"
            >
              <Home className="mr-2 w-3 h-3" />
              Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelPage;
