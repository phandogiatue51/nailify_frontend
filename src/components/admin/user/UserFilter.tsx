import { ProfileFilter, UserRole } from "@/types/filter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserFilterProps {
  filters: ProfileFilter;
  onFilterChange: (filters: ProfileFilter) => void;
}

export const UserFilter = ({ filters, onFilterChange }: UserFilterProps) => {
  const handleChange = (key: keyof ProfileFilter, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFilterChange({});
  };

  const roleOptions = [
    { value: "0", label: "Khách hàng" },
    { value: "1", label: "Chủ cửa hàng" },
    { value: "3", label: "Quản lý cửa hàng" },
    { value: "4", label: "Thợ nail" },
  ];

  return (
    <Card className="border-2 border-slate-100 rounded-[2.5rem] shadow-sm bg-white overflow-hidden transition-all duration-300 focus-within:border-[#950101]/30">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="flex-1 w-full group">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#950101] transition-colors" />
              <Input
                id="search"
                placeholder="Tìm kiếm bằng tên hoặc email ..."
                className="pl-10 h-10 rounded-2xl border-slate-100 bg-slate-50/50 font-black text-[10px] tracking-widest focus-visible:ring-[#950101] focus-visible:border-[#950101] transition-all"
                value={filters.SearchTerm || ""}
                onChange={(e) => handleChange("SearchTerm", e.target.value)}
              />
            </div>
          </div>

          {/* Role Select */}
          <div className="w-full lg:w-48">
            <Select
              value={filters.Role?.toString() || undefined}
              onValueChange={(value) =>
                handleChange("Role", value ? Number(value) : undefined)
              }
            >
              <SelectTrigger
                id="role"
                className="h-12 rounded-2xl border-slate-100 bg-white font-black text-[12px] tracking-widest hover:bg-slate-50 transition-all"
              >
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                {roleOptions.map((role) => (
                  <SelectItem
                    key={role.value}
                    value={role.value.toString()}
                    className="font-bold text-xs"
                  >
                    {role.label.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Toggles & Reset */}
          <div className="flex flex-wrap items-center justify-between w-full lg:w-auto gap-6 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
            {/* Active Status */}
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
                className="cursor-pointer font-black text-[9px] tracking-[0.2em] uppercase text-slate-500 hover:text-slate-900 transition-colors"
              >
                Đang hoạt động
              </Label>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-10 px-4 rounded-xl font-black text-[9px] tracking-widest uppercase text-[#950101] hover:bg-red-50 hover:text-[#950101] transition-all"
            >
              Hủy
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserFilter;
