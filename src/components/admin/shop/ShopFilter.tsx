import { ShopFilterDto } from "@/types/filter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Store, Star } from "lucide-react";

interface ShopFilterProps {
  filters: ShopFilterDto;
  onFilterChange: (filters: ShopFilterDto) => void;
}

export const ShopFilter = ({ filters, onFilterChange }: ShopFilterProps) => {
  const handleChange = (key: keyof ShopFilterDto, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFilterChange({});
  };

  return (
    <Card className="border-2 border-slate-100 rounded-[2.5rem] shadow-sm bg-white overflow-hidden transition-all duration-300 focus-within:border-[#950101]/30">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Main Search */}
          <div className="flex-1 w-full group">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#950101] transition-colors" />
              <Input
                id="search"
                placeholder="Tìm kiếm theo tên cửa hàng ..."
                className="pl-10 h-12 rounded-2xl border-slate-100 bg-slate-50/50 font-black text-[12px] tracking-widest focus-visible:ring-[#950101] focus-visible:border-[#950101] transition-all "
                value={filters.Name || ""}
                onChange={(e) => handleChange("Name", e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between w-full lg:w-auto gap-10 pt-6 lg:pt-0 lg:pl-8">
            <div className="flex items-center space-x-3">
              <Switch
                id="verified"
                className="data-[state=checked]:bg-[#950101]"
                checked={filters.IsVerified === true}
                onCheckedChange={(checked) =>
                  handleChange("IsVerified", checked ? true : undefined)
                }
              />
              <Label
                htmlFor="verified"
                className="cursor-pointer font-black text-[12px] tracking-[0.2em] text-slate-500 hover:text-slate-900 transition-colors"
              >
                Đã xác minh
              </Label>
            </div>

            {/* Active Switch */}
            <div className="flex items-center space-x-3">
              <Switch
                id="active"
                className="data-[state=checked]:bg-emerald-500"
                checked={filters.IsActive === true}
                onCheckedChange={(checked) =>
                  handleChange("IsActive", checked ? true : undefined)
                }
              />
              <Label
                htmlFor="active"
                className="cursor-pointer font-black text-[12px] tracking-[0.2em]  text-slate-500 hover:text-slate-900 transition-colors"
              >
                Hoạt động
              </Label>
            </div>

            {/* Rating Input - Minimalist Style */}
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-xl border border-slate-100">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                placeholder="4.0"
                className="w-10 bg-transparent border-none text-[12px] font-black focus:ring-0 p-0"
                value={filters.Rating || ""}
                onChange={(e) =>
                  handleChange(
                    "Rating",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
            </div>

            {/* Reset Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-10 px-4 rounded-xl font-black text-[12px] tracking-widest  text-[#950101] hover:bg-red-50 hover:text-[#950101] transition-all"
            >
              Làm mới
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopFilter;
