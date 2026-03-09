const roleMap: Record<number, { label: string; color: string; border: string }> = {
  0: {
    label: "Đang hoạt động",
    color: "bg-gradient-to-r from-emerald-100 to-emerald-300 text-emerald-900",
    border: "border-emerald-300",
  },
  1: {
    label: "Đã hết hạn",
    color: "bg-gradient-to-r from-slate-100 to-slate-300 text-slate-900", // Gray for "dead" states
    border: "border-slate-300",
  },
  2: {
    label: "Đã hủy",
    color: "bg-gradient-to-r from-rose-100 to-rose-300 text-rose-900", // Rose/Red for cancelled
    border: "border-rose-300",
  },
  3: {
    label: "Đang chờ xử lý",
    color: "bg-gradient-to-r from-amber-100 to-amber-300 text-amber-900", // Amber for "waiting"
    border: "border-amber-300",
  }
};

export const SubscriptionStatusBadge = ({ status }: { status: number }) => {
  const roleInfo = roleMap[status];
  if (!roleInfo) return null;

  return (
    <span
      className={`
        px-2.5 py-0.5 
        rounded-full 
        text-xs font-semibold 
        border shadow-sm 
        inline-flex items-center
        ${roleInfo.color} 
        ${roleInfo.border}
      `}
    >
      {roleInfo.label}
    </span>
  );
};
