import { Sparkles, Store } from "lucide-react";
import ShopForm from "@/components/shop/ShopForm";

export const ShopSetupView = ({
  onSubmit,
  isLoading,
}: {
  onSubmit: (formData: any) => Promise<void>;
  isLoading: boolean;
}) => {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden p-6">
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 rounded-full bg-[#FFC988]/30 blur-3xl" />
      <div className="absolute bottom-[-5%] left-[-10%] w-72 h-72 rounded-full bg-[#E288F9]/20 blur-3xl" />

      <div className="relative z-10 max-w-md mx-auto space-y-8 pt-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2.5rem] bg-gradient-to-br from-[#FFC988] to-[#E288F9] shadow-lg shadow-purple-100 mb-4 animate-bounce-slow">
            <Store className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Design Your <span className="italic text-[#E288F9]">Empire</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Give your salon a name and personality. This is how customers will
            find your magic.
          </p>
        </div>

        <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
          <ShopForm onSubmit={onSubmit} isLoading={isLoading} />
        </div>

        <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest pt-4">
          <Sparkles className="w-4 h-4 text-[#FFC988]" />
          Powered by Nailify
        </div>
      </div>
    </div>
  );
};
