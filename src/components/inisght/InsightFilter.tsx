// components/insights/InsightFilter.tsx
import React, { useState } from "react";
import { InsightFilters } from "@/types/filter";
import { Filter, MapPin } from "lucide-react";
import { ShopLocation } from "@/types/database";

interface InsightFilterProps {
  onFilterChange: (filters: InsightFilters) => void;
  initialFilters?: InsightFilters;
  showLocationFilter?: boolean; // New prop
  shopLocations?: ShopLocation[]; // New prop
}

const InsightFilter: React.FC<InsightFilterProps> = ({
  onFilterChange,
  initialFilters = {},
  showLocationFilter = false,
  shopLocations = [],
}) => {
  const [filters, setFilters] = useState<InsightFilters>({
    thisWeek: initialFilters.thisWeek || false,
    thisMonth: initialFilters.thisMonth || false,
    startDate: initialFilters.startDate || "",
    endDate: initialFilters.endDate || "",
    shopLocationId: initialFilters.shopLocationId || "",
  });

  const handlePresetChange = (preset: "week" | "month" | "today") => {
    const newFilters = { ...filters };

    if (preset === "week") {
      newFilters.thisWeek = true;
      newFilters.thisMonth = false;
    } else if (preset === "month") {
      newFilters.thisWeek = false;
      newFilters.thisMonth = true;
    } else {
      newFilters.thisWeek = false;
      newFilters.thisMonth = false;
    }

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleLocationChange = (locationId: string) => {
    const newFilters = {
      ...filters,
      shopLocationId: locationId,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="p-2">
      <div className="flex flex-col gap-4">
        {/* First row: Title and Preset Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            {[
              {
                id: "week" as const,
                label: "Tuần trước",
                active: filters.thisWeek,
              },
              {
                id: "month" as const,
                label: "Tháng này",
                active: filters.thisMonth,
              },
              {
                id: "today" as const,
                label: "Hôm nay",
                active: !filters.thisWeek && !filters.thisMonth,
              },
            ].map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetChange(preset.id)}
                className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  preset.active
                    ? "bg-white text-[#950101] shadow-sm scale-[1.02] ring-1 ring-slate-200"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
                }`}
                aria-pressed={preset.active}
                type="button"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Second row: Location Filter - Only shown for shop users */}
        {showLocationFilter && shopLocations.length > 0 && (
          <div className="flex flex-col md:flex-row md:items-center gap-4 mt-2 ">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#FFCFE9]" />
              <span className="text-xs font-bold text-slate-500">
                Chi nhánh:
              </span>
            </div>

            <div className="flex flex-wrap gap-2 ">
              <button
                onClick={() => handleLocationChange("")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-300 uppercase ${
                  !filters.shopLocationId
                    ? "bg-[#950101] text-white shadow-sm"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200"
                }`}
                type="button"
              >
                Tất cả
              </button>

              {shopLocations.map((location) => (
                <button
                  key={location.shopLocationId}
                  onClick={() => handleLocationChange(location.shopLocationId)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all duration-300 ${
                    filters.shopLocationId === location.shopLocationId
                      ? "bg-[#950101] text-white shadow-sm"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200"
                  }`}
                  type="button"
                >
                  {location.address}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightFilter;
