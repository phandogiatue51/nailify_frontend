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
    <div className="min-h-screen bg-slate-50/50">
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
            <span className="font-bold text-slate-600">Trờ về</span>
          </Button>

        </div>

        <div className="px-2">
          <h1
          className="font-black tracking-tight uppercase text-xl bg-clip-text text-transparent pb-1"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #950101 0%, #D81B60 50%, #FFCFE9 100%)",
            WebkitBackgroundClip: "text",
          }}
        >
            Cập nhật thông tin cửa hàng
          </h1>

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
      </div>
    </div>
  );
};

export default ShopEditView;
