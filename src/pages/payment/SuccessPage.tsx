"use client";
import { CheckCircle2, Calendar, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/ui/header";

export const SuccessPage = () => {
  const nagivate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <Header title="Booking Confirmed" />

      <div className="px-6 pt-16 flex flex-col items-center text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-emerald-100 rounded-full scale-150 animate-ping opacity-20" />
          <div className="relative bg-emerald-500 p-6 rounded-full shadow-xl shadow-emerald-200">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
          Subscription Purchased!
        </h1>
        <p className="text-slate-500 font-medium leading-relaxed max-w-[280px] mb-10">
          Your payment was successful!
        </p>

        <div className="w-full bg-slate-50 rounded-[2.5rem] p-6 mb-10 border border-slate-100">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200/50">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl shadow-sm">
                <Calendar className="w-5 h-5 text-[#950101]" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Status
                </p>
                <p className="text-sm font-black text-slate-900">
                  Subscription Active
                </p>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-bold italic">
            A confirmation receipt has been sent to your email.
          </p>
        </div>

        <div className="w-full space-y-3">
          <Button
            onClick={() => nagivate("/my-subscriptions")}
            className="w-full h-14 rounded-full bg-slate-900 text-white font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all"
          >
            View My Subscriptions
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            onClick={() => nagivate("/")}
            className="w-full h-14 rounded-full text-slate-400 font-black uppercase text-xs tracking-widest"
          >
            <Home className="mr-2 w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
