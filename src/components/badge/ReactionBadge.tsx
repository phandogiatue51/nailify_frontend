import { cn } from "@/lib/utils";
import { FaAngry, FaSadTear, FaSurprise, FaLaughSquint } from "react-icons/fa";
import { BiSolidLike } from "react-icons/bi";
import { FcLike } from "react-icons/fc";

const reactionMap: Record<
  number,
  {
    label: string;
    bg: string;
    text: string;
    icon: React.ReactNode;
    shadow: string;
  }
> = {
  0: {
    label: "Thích",
    bg: "bg-blue-50",
    text: "text-blue-600",
    icon: <BiSolidLike size={12} className="fill-blue-600" />,
    shadow: "shadow-blue-100",
  },
  1: {
    label: "Thả Tym",
    bg: "bg-rose-50",
    text: "text-rose-600",
    icon: <FcLike  size={12} className="fill-rose-600" />,
    shadow: "shadow-rose-100",
  },
  2: {
    label: "Buồn Cười",
    bg: "bg-orange-50",
    text: "text-orange-600",
    icon: <FaLaughSquint size={12} className="fill-orange-600" />,
    shadow: "shadow-orange-100",
  },
  3: {
    label: "Ngạc Nhiên",
    bg: "bg-amber-50",
    text: "text-amber-600",
    icon: <FaSurprise size={12} className="fill-amber-600" />,
    shadow: "shadow-amber-100",
  },
  4: {
    label: "Buồn Bã",
    bg: "bg-slate-100",
    text: "text-slate-600",
    icon: <FaSadTear size={12} className="fill-slate-600" />,
    shadow: "shadow-slate-200",
  },
  5: {
    label: "Tức Giận",
    bg: "bg-red-50",
    text: "text-red-600",
    icon: <FaAngry  size={12} className="fill-red-600" />,
    shadow: "shadow-red-100",
  },
};

export const ReactionBadge = ({ type }: { type: number }) => {
  const info = reactionMap[type];
  if (!info) return null;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
        "text-[10px] font-black uppercase tracking-widest transition-all",
        "shadow-sm border border-white/50",
        info.bg,
        info.text,
        info.shadow,
      )}
    >
      <span className="shrink-0">{info.icon}</span>
      {info.label}
    </div>
  );
};
