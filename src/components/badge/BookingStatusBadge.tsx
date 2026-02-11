import { cn } from "@/lib/utils";
const roleMap: Record<number, { label: string; bg: string }> = {
  0: {
    label: "Pending",
    bg: "bg-orange-400",
  },
  1: {
    label: "Approved",
    bg: "bg-blue-400",
  },
  2: {
    label: "Rejected",
    bg: "bg-purple-400",
  },
  3: {
    label: "Completed",
    bg: "bg-green-400",
  },
  4: {
    label: "Cancelled",
    bg: "bg-red-400",
  },
};

export const BookingStatusBadge = ({ status }: { status: number }) => {
  const roleInfo = roleMap[status];
  if (!roleInfo) return null;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white",
        roleInfo.bg,
      )}
    >
      {roleInfo.label}
    </div>
  );
};
