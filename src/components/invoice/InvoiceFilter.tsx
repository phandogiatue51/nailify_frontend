import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { InvoiceFilterDto, InvoiceStatus } from "@/types/filter";

export const InvoiceFilter = ({
  filters,
  onFilterChange,
}: {
  filters: InvoiceFilterDto;
  onFilterChange: (f: InvoiceFilterDto) => void;
}) => {
  const statusMap: Record<string, InvoiceStatus | undefined> = {
    "Tất cả": undefined,
    "Chờ xử lý": InvoiceStatus.Pending,
    "Đã thanh toán": InvoiceStatus.Paid,
    "Thất bại": InvoiceStatus.Cancelled,
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
        <Input
          placeholder="Tìm mã đơn hàng..."
          className="h-14 pl-12 pr-4 border-2 border-slate-50 rounded-2xl bg-white shadow-sm font-bold"
          value={filters.orderCode?.toString() || ""}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              orderCode: Number(e.target.value) || undefined,
            })
          }
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {Object.keys(statusMap).map((label) => {
          const value = statusMap[label];
          const isActive = filters.status === value;
          return (
            <button
              key={label}
              onClick={() => onFilterChange({ ...filters, status: value })}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-bold
          ${isActive ? "bg-[#950101] text-white" : "bg-white text-slate-700"}
        `}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
