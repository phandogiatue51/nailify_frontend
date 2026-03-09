import {
  InvoiceFilterDto,
  SubscriptionTier,
  InvoiceStatus,
} from "@/types/filter";
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
import { Filter, Search } from "lucide-react";
import { Label } from "@radix-ui/react-label";

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

  const resetFilters = () => {
    onFilterChange({});
  };

  return (
    <Card className="bg-white border-slate-100 shadow-sm rounded-[2rem] overflow-hidden">
      <CardContent className="p-0">
        {/* Header Section with Brand Color Accent */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-50 bg-slate-50/30">
          <div className="flex items-center gap-3">
            <div className="bg-[#950101] p-2 rounded-xl shadow-lg shadow-[#950101]/20">
              <Filter className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-tighter text-slate-800">
                Bộ lọc hóa đơn
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Advanced Search
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-[10px] font-black uppercase tracking-widest border border-slate-400 rounded-xl text-slate-400 hover:text-red-800 hover:bg-transparent hover:border-red-800"
          >
            Làm mới tất cả
          </Button>
        </div>

        {/* Filter Inputs Grid */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Status Filter */}
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
              Trạng thái
            </Label>
            <Select
              value={filters.status !== undefined ? String(filters.status) : ""}
              onValueChange={(value) =>
                handleChange("status", value ? Number(value) : undefined)
              }
            >
              <SelectTrigger className="h-12 border-slate-200 rounded-2xl focus:ring-[#950101]/10 focus:border-[#950101] bg-slate-50/50 font-medium transition-all">
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                {Object.keys(InvoiceStatus)
                  .filter((key) => isNaN(Number(key)))
                  .map((key) => (
                    <SelectItem
                      key={key}
                      value={String(
                        InvoiceStatus[key as keyof typeof InvoiceStatus],
                      )}
                      className="rounded-xl focus:bg-[#950101]/5 focus:text-[#950101] font-bold py-3"
                    >
                      {key}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subscription Tier Filter */}
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
              Gói thành viên
            </Label>
            <Select
              value={filters.tier !== undefined ? String(filters.tier) : ""}
              onValueChange={(value) =>
                handleChange("tier", value ? Number(value) : undefined)
              }
            >
              <SelectTrigger className="h-12 border-slate-200 rounded-2xl focus:ring-[#950101]/10 focus:border-[#950101] bg-slate-50/50 font-medium transition-all">
                <SelectValue placeholder="Tất cả các gói" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                {Object.keys(SubscriptionTier)
                  .filter((key) => isNaN(Number(key)))
                  .map((key) => (
                    <SelectItem
                      key={key}
                      value={String(
                        SubscriptionTier[key as keyof typeof SubscriptionTier],
                      )}
                      className="rounded-xl focus:bg-[#950101]/5 focus:text-[#950101] font-bold py-3"
                    >
                      {key}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Order Code Filter */}
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
              Mã đơn hàng
            </Label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <Input
                id="orderCode"
                type="number"
                placeholder="Tìm mã đơn..."
                className="h-12 pl-12 border-slate-200 rounded-2xl focus:ring-[#950101]/10 focus:border-[#950101] bg-slate-50/50 font-bold placeholder:text-slate-300 placeholder:font-medium transition-all"
                value={filters.orderCode || ""}
                onChange={(e) =>
                  handleChange(
                    "orderCode",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};  

export default InvoiceFilter;
