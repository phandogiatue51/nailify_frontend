import { cn } from "@/lib/utils";
const roleMap: Record<number, { label: string; bg: string }> = {
  0: {
    label: "Đang chờ xác nhận",
    bg: "bg-orange-400",
  },
  1: {
    label: "Đã xác nhận",
    bg: "bg-blue-400",
  },
  2: {
    label: "Đã từ chối",
    bg: "bg-purple-400",
  },
  3: {
    label: "Đã hoàn thành",
    bg: "bg-green-400",
  },
  4: {
    label: "Đã hủy",
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
