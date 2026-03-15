import { TrendingUp, Sparkles, Target, Zap } from "lucide-react";

export const StatCard = ({ title, value, color = "garnet" }) => {
  // Mapping boutique-themed icons and shades
  const themes = {
    garnet: {
      container: "bg-white border-b-4 border-[#950101]",
      icon: <Target className="w-4 h-4 text-[#950101]" />,
      text: "text-slate-900",
      label: "text-[#950101]",
    },
    pink: {
      container: "bg-white border-b-4 border-[#D81B60]",
      icon: <Sparkles className="w-4 h-4 text-[#D81B60]" />,
      text: "text-slate-900",
      label: "text-[#D81B60]",
    },
    emerald: {
      container: "bg-white border-b-4 border-emerald-500",
      icon: <TrendingUp className="w-4 h-4 text-emerald-500" />,
      text: "text-slate-900",
      label: "text-emerald-600",
    },
    blue: {
      container: "bg-white border-b-4 border-blue-500",
      icon: <Zap className="w-4 h-4 text-[#FFCFE9]" />,
      text: "text-slate-900",
      label: "text-blue-400",
    },
  };

  const activeTheme = themes[color] || themes.garnet;

  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 ${activeTheme.container}`}
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-[10px] font-black uppercase tracking-[0.2em] ${activeTheme.label}`}
        >
          {title}
        </span>
        <div className="opacity-80">{activeTheme.icon}</div>
      </div>

      <div
        className={`text-3xl font-black tracking-tighter ${activeTheme.text}`}
      >
        {value}
      </div>

      <div className="absolute -right-2 -bottom-2 w-16 h-16 opacity-[0.03] pointer-events-none">
        {activeTheme.icon}
      </div>
    </div>
  );
};
