import { InvoiceFilterDto, SubscriptionTier } from "@/types/filter";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface InvoiceFilterProps {
  filters: InvoiceFilterDto;
  onFilterChange: (filters: InvoiceFilterDto) => void;
}

export const InvoiceFilter = ({
  filters,
  onFilterChange,
}: InvoiceFilterProps) => {
  const handleChange = (key: keyof InvoiceFilterDto, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const subscriptionTierLabels: Record<SubscriptionTier, string> = {
    0: "Miễn phí", // Free
    1: "Cơ bản", // Basic
    2: "Nâng cao", // Premium
    3: "Doanh nghiệp", // Business
  };

  const resetFilters = () => onFilterChange({});

  return (
    <Card className="border-2 border-slate-100 rounded-[2.5rem] shadow-sm bg-white overflow-hidden transition-all duration-300 focus-within:border-[#950101]/30">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Main Search - Order Code */}
          <div className="flex-1 w-full relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#950101] transition-colors" />
            <Input
              type="number"
              placeholder="Tìm kiếm theo mã đơn ..."
              className="pl-10 h-12 rounded-2xl border-slate-100 bg-slate-50/50 font-black text-[12px] tracking-widest focus-visible:ring-[#950101] transition-all "
              value={filters.orderCode || ""}
              onChange={(e) =>
                handleChange(
                  "orderCode",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
            />
          </div>

          <div className="flex flex-wrap items-center justify-between w-full lg:w-auto gap-4">
            <Select
              value={filters.tier !== undefined ? String(filters.tier) : "all"}
              onValueChange={(value) =>
                handleChange(
                  "tier",
                  value === "all" ? undefined : Number(value),
                )
              }
            >
              <SelectTrigger className="h-12 w-full lg:w-44 rounded-2xl border-slate-100 bg-white font-black text-[11px] tracking-widest hover:bg-slate-50 transition-all ">
                <SelectValue placeholder="Gói thành viên" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all" className="font-bold text-xs">
                  Tất cả gói
                </SelectItem>
                {Object.entries(subscriptionTierLabels).map(
                  ([value, label]) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className="font-bold text-xs"
                    >
                      {label}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>

            {/* Reset Button */}
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="h-10 px-6 rounded-xl font-black text-[11px] tracking-widest text-[#950101] hover:bg-red-50  transition-all"
            >
              Làm mới
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceFilter;
