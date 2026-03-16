import { Sparkles } from "lucide-react";
import { Button } from "./button";
export const EmptyTabState = ({ title, desc, onAction }) => (
  <div className="flex flex-col items-center justify-center py-16 px-10 text-center space-y-4 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
      <Sparkles className="w-8 h-8 text-slate-200" />
    </div>
    <div>
      <h3 className="font-bold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{desc}</p>
    </div>
    <Button
      variant="link"
      onClick={onAction}
      className="text-[#E288F9] font-black text-xs uppercase tracking-widest"
    >
      Bắt đầu
    </Button>
  </div>
);
