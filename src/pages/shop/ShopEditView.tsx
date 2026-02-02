import { ArrowLeft, Save, Sparkles, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShopForm from "@/components/shop/ShopForm";

interface ShopEditViewProps {
  myShop: any;
  onCancel: () => void;
  isLoading: boolean;
  onSubmit: (formData: any) => Promise<void>;
}

const ShopEditView = ({
  myShop,
  onCancel,
  onSubmit,
  isLoading,
}: ShopEditViewProps) => {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-10">
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-r from-[#FFC988] to-[#E288F9] opacity-20" />

      <div className="relative z-10 p-4 space-y-6">
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-white hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2 text-slate-600" />
            <span className="font-bold text-slate-600">Back</span>
          </Button>

          <div className="flex items-center gap-1 text-[#E288F9]">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Live Preview
            </span>
          </div>
        </div>

        <div className="px-2 pt-4">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
            Edit Shop
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Keep your salon details fresh and inviting for your clients.
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
          <div className="p-6">
            <ShopForm
              initialData={myShop}
              onSubmit={onSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Bottom Context Info */}
        <p className="text-center text-[10px] text-slate-400 font-medium px-10 leading-relaxed uppercase tracking-widest opacity-60">
          Changes made here will be visible to all customers immediately.
        </p>
      </div>
    </div>
  );
};

export default ShopEditView;
