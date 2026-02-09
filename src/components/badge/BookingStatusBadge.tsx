import { cn } from "@/lib/utils";
const roleMap: Record<
  number,
  { label: string; dot: string; bg: string; text: string }
> = {
  0: {
    label: "Pending",
    dot: "bg-orange-400",
    bg: "bg-orange-50",
    text: "text-orange-600",
  },
  1: {
    label: "Approved",
    dot: "bg-green-400",
    bg: "bg-green-50",
    text: "text-green-600",
  },
  2: {
    label: "Rejected",
    dot: "bg-red-400",
    bg: "bg-red-50",
    text: "text-red-600",
  },
  3: {
    label: "Completed",
    dot: "bg-teal-400",
    bg: "bg-teal-50",
    text: "text-teal-600",
  },
  4: {
    label: "Cancelled",
    dot: "bg-slate-400",
    bg: "bg-slate-50",
    text: "text-slate-600",
  },
};

export const BookingStatusBadge = ({ status }: { status: number }) => {
  const roleInfo = roleMap[status];
  if (!roleInfo) return null;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
        roleInfo.bg,
        roleInfo.text,
      )}
    >
      {roleInfo.label}
    </div>
  );
};
