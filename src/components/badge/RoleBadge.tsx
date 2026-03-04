const roleMap: Record<number, { label: string; className: string }> = {
  0: {
    label: "Khách hàng",
    className: "bg-slate-100 text-slate-500 border-slate-200",
  },
  1: {
    label: "Cửa hàng",
    className: "bg-[#FFCFE9]/30 text-[#D81B60] border-[#FFCFE9]/50",
  },
  2: {
    label: "Hệ thống",
    className:
      "bg-slate-900 text-white shadow-lg shadow-black/10 border-slate-800 ring-1 ring-slate-900/10",
  },
  3: {
    label: "Quản lý cửa hàng",
    className: "bg-slate-800 text-white border-slate-700",
  },
  4: {
    label: "Thợ nail",
    className: "bg-[#950101]/10 text-[#950101] border-[#950101]/20",
  },
};

export const RoleBadge = ({ role }: { role: number }) => {
  const roleInfo = roleMap[role];
  if (!roleInfo) return null;

  return (
    <span
      className={`
        px-3 py-1 rounded-full 
        text-[10px] font-black uppercase tracking-widest 
        border transition-all duration-300
        ${roleInfo.className}
      `}
    >
      {roleInfo.label}
    </span>
  );
};
