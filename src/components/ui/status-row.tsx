import { CircleCheckBig, CircleX } from "lucide-react";

export const StatusRow = ({ label, isVerified }) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
      {label}
    </span>
    <div className="flex items-center gap-1">
      {isVerified ? (
        <CircleCheckBig className="w-5 h-5 text-emerald-600" />
      ) : (
        <CircleX className="w-5 h-5 text-red-500" />
      )}
    </div>
  </div>
);
