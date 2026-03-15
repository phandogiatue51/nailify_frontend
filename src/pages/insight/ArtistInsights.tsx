// components/insights/ArtistInsights.tsx
import React from "react";
import { useArtistInsights } from "@/hooks/useInsight";
import { InsightFilters } from "@/types/filter";
import InsightFilter from "../../components/inisght/InsightFilter";
import CustomerList from "../../components/inisght/CustomerList";
import PopularCollectionList from "../../components/inisght/PopularCollectionList";
import PeakHoursChart from "../../components/inisght/PeakHoursChart";
import { Loader2, Star } from "lucide-react";
import { StatCard } from "@/components/inisght/StatCard";

interface ArtistInsightsProps {
  initialFilters?: InsightFilters;
}

const ArtistInsights: React.FC<ArtistInsightsProps> = ({ initialFilters }) => {
  const [filters, setFilters] = React.useState<InsightFilters>(
    initialFilters || {},
  );
  const { data, isLoading, error } = useArtistInsights(filters);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-red-600">
          Error loading artist insights
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white p-4 rounded-[2rem] border border-slate-50 shadow-sm mb-6">
        <InsightFilter
          onFilterChange={setFilters}
          initialFilters={initialFilters}
        />
      </div>

      <div className="bg-white rounded-[3rem] p-8 border border-slate-50 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
        {/* Editorial Header */}
        <div className="mb-4">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D81B60] block mb-2">
            Phân tích hiệu suất
          </span>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            Đánh giá tổng quan
          </h2>
        </div>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
            value={`${data.averageBookingValue ? Number(data.averageBookingValue).toLocaleString() : "0"} đ`}
            color="blue"
          />
        </div>

        {/* Secondary Intelligence Row */}
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

        {/* Detailed Customer Interaction */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-slate-50/50 rounded-[2.5rem]">
            <CustomerList
              title="Khách hàng mới"
              customers={data?.newCustomers || []}
            />
          </div>
          <div className="bg-slate-50/50 rounded-[2.5rem]">
            <CustomerList
              title="Khách hàng thân thiết"
              customers={data?.returningCustomers || []}
            />
          </div>
        </div>

        {/* Signature Trends */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <PopularCollectionList
              collections={data?.popularCollections || []}
            />
          </div>
          <div>
            <PeakHoursChart hours={data?.PeakHours || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistInsights;
