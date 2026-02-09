import { Search, MapPin, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StaffFilterProps {
  filters: {
    SearchTerm: string;
    IsActive: boolean | undefined;
    ShopLocationId: string;
  };
  locations: any[];
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
}

export const StaffFilter = ({
  filters,
  locations,
  onFilterChange,
  onClearFilters,
}: StaffFilterProps) => {
  return (
    <div className="space-y-4">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#E288F9] transition-colors" />
        <Input
          placeholder="Search by name or email..."
          value={filters.SearchTerm}
          onChange={(e) => onFilterChange("SearchTerm", e.target.value)}
          className="pl-11 h-12 rounded-2xl focus-visible:ring-[#E288F9] font-bold transition-all"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <div className="relative flex-shrink-0 min-w-[140px]">
          <select
            value={filters.ShopLocationId}
            onChange={(e) => onFilterChange("ShopLocationId", e.target.value)}
            className="w-full h-10 pl-3 pr-8 rounded-xl bg-white border text-xs font-bold text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-[#E288F9]/20"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc.shopLocationId} value={loc.shopLocationId}>
                {loc.address}
              </option>
            ))}
          </select>
          <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
        </div>

        <div className="relative flex-shrink-0 min-w-[120px]">
          <select
            value={
              filters.IsActive === undefined ? "" : filters.IsActive.toString()
            }
            onChange={(e) => {
              const val = e.target.value;
              onFilterChange(
                "IsActive",
                val === "" ? undefined : val === "true",
              );
            }}
            className="w-full h-10 pl-3 pr-8 rounded-xl bg-white border text-xs font-bold text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-[#E288F9]/20"
          >
            <option value="">All Status</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
        </div>

        {/* Clear Button */}
        <Button
          variant="ghost"
          onClick={onClearFilters}
          className="h-10 px-3 rounded-xl text-[10px] font-black uppercase border border-red-300 tracking-widest text-red-400 hover:text-red-500 hover:bg-red-50"
        >
          <X className="w-3 h-3 mr-1" />
          Clear
        </Button>
      </div>
    </div>
  );
};
