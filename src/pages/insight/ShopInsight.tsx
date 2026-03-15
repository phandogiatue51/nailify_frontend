// components/insights/ShopInsights.tsx
import React from "react";
import {
  useShopInsights,
  useShopLocationInsights, // Change this import
} from "@/hooks/useInsight";
import { InsightFilters } from "@/types/filter";
import InsightFilter from "../../components/inisght/InsightFilter";
import { StatCard } from "../../components/inisght/StatCard";
import CustomerList from "../../components/inisght/CustomerList";
import PopularCollectionList from "../../components/inisght/PopularCollectionList";
import PeakHoursChart from "../../components/inisght/PeakHoursChart";
import { Loader2, Star } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocationsByShop } from "@/hooks/useLocation";

interface ShopInsightsProps {
  initialFilters?: InsightFilters;
}

const ShopInsights: React.FC<ShopInsightsProps> = ({ initialFilters }) => {
  const [filters, setFilters] = React.useState<InsightFilters>(
    initialFilters || {},
  );

  const { user } = useAuth();
  const isShopUser = user?.role === 1;
  const shopId = user?.shopId;

  const { data: shopLocations = [] } = useLocationsByShop(
    isShopUser ? shopId : undefined,
  );

  // Determine which hook to use based on location selection
  const hasLocationSelected = !!filters.shopLocationId;
  const selectedLocationId = filters.shopLocationId;

  // Debug logs
  React.useEffect(() => {
    console.log("Filters:", filters);
    console.log("Has location selected:", hasLocationSelected);
    console.log("Selected location ID:", selectedLocationId);
  }, [filters]);

  // For shop-level insights (no location selected or "All Locations")
  const shopQuery = useShopInsights(
    !hasLocationSelected
      ? filters
      : {
          thisWeek: filters.thisWeek,
          thisMonth: filters.thisMonth,
          startDate: filters.startDate,
          endDate: filters.endDate,
          // Don't include shopLocationId
        },
  );

  // For location-specific insights - use shopLocation with the selected ID
  const locationQuery = useShopLocationInsights(
    selectedLocationId || "", // Pass the selected location ID
    hasLocationSelected
      ? {
          thisWeek: filters.thisWeek,
          thisMonth: filters.thisMonth,
          startDate: filters.startDate,
          endDate: filters.endDate,
          // Don't include shopLocationId here as it's already in the URL
        }
      : undefined,
  );

  console.log(
    "Using hook:",
    hasLocationSelected ? "locationQuery" : "shopQuery",
  );
  console.log(
    "Location query enabled:",
    !!selectedLocationId && hasLocationSelected,
  );

  // Use the appropriate data based on selection
  const { data, isLoading, error } = hasLocationSelected
    ? locationQuery
    : shopQuery;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    console.error("Query error:", error);
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-red-600">Error loading shop insights</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="bg-white p-4 rounded-[2rem] border border-slate-50 shadow-lg mb-6">
        <InsightFilter
          onFilterChange={setFilters}
          initialFilters={filters}
          showLocationFilter={isShopUser}
          shopLocations={shopLocations}
        />
      </div>

      {/* Show which location is selected */}
      {hasLocationSelected && (
        <div className="mt-4 border-t border-slate-50 flex items-center gap-3 px-2">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#950101] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#950101]"></span>
          </div>
          <p className="text-sm font-black  tracking-[0.2em] text-slate-400">
            Chi nhánh đã chọn:
            <span className="ml-2 text-slate-900 tracking-normal normal-case font-bold">
              {shopLocations.find(
                (l) => l.shopLocationId === filters.shopLocationId,
              )?.address || "Selected Studio"}
            </span>
          </p>
        </div>
      )}

      <div className="rounded-[3rem] mt-4">
        {/* Brand Header */}
        <div className="mb-4">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D81B60] block mb-2">
            Phân tích hiệu suất
          </span>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            {hasLocationSelected ? "Chi tiết cửa hàng" : "Đánh giá tổng quan"}
          </h2>
        </div>

        {/* Primary Performance Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Tổng lịch hẹn"
            value={data?.totalBookings || 0}
            color="pink"
          />
          <StatCard
            title="Đã hoàn thành"
            value={data?.completedBookings || 0}
            color="emerald"
          />
          <StatCard
            title="Đã hủy"
            value={data?.cancelledBookings || 0}
            color="garnet"
          />
          <StatCard
            title="TB Giá Tiền"
            value={`${data?.averageBookingValue ? Number(data.averageBookingValue).toLocaleString() : "0"} đ`}
            color="blue"
          />
        </div>

        {/* Strategic Overview Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-[#950101] rounded-[2.5rem] p-8 text-white">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Star className="w-20 h-20 fill-white" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-6">
              Đánh giá tổng quan
            </h3>
            <div className="flex items-center gap-4">
              <div className="text-6xl font-black italic tracking-tighter">
                {data?.averageRating?.toFixed(1) || "0.0"}
              </div>
              <div className="space-y-1">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < Math.round(data?.averageRating || 0) ? "fill-amber-400 text-amber-400" : "text-white/50"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border-2 border-slate-50 flex flex-col justify-center shadow-md">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Mức độ thân thiết khách hàng
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50">
                <span className="text-sm font-black text-slate-600 uppercase tracking-tighter">
                  Khách hàng mới
                </span>
                <span className="text-xl font-black text-slate-900">
                  {data?.newCustomers?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-black text-slate-600 uppercase tracking-tighter">
                  Khách hàng thân thiết
                </span>
                <span className="text-xl font-black text-[#D81B60]">
                  {data?.returningCustomers?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Segments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <CustomerList
            title="Khách hàng mới"
            customers={data?.newCustomers || []}
          />
          <CustomerList
            title="Khách hàng thân thiết"
            customers={data?.returningCustomers || []}
          />
        </div>

        {/* Revenue Trends & Operational Peaks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PopularCollectionList collections={data?.popularCollections || []} />
          <PeakHoursChart hours={data?.PeakHours || []} />
        </div>
      </div>
    </div>
  );
};

export default ShopInsights;
