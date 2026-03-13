import { Card, CardContent } from "@/components/ui/card";
import { useDashboard } from "@/hooks/useDashboard";
import {
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface QuickStatsProps {
  shopId?: string;
  artistId?: string;
  shopLocationId?: string;
  period?: "today" | "week" | "month" | "custom";
  startDate?: string;
  endDate?: string;
  compact?: boolean;
}

const QuickStats = ({
  shopId,
  artistId,
  shopLocationId,
  period = "today",
  startDate,
  endDate,
  compact = false,
}: QuickStatsProps) => {
  const { useQuickStats, useStats } = useDashboard();

  const { data: quickStats, isLoading: quickLoading } = useQuickStats({
    shopId,
    artistId,
    shopLocationId,
  });

  const { data: periodStats, isLoading: periodLoading } = useStats({
    shopId,
    artistId,
    shopLocationId,
    startDate,
    endDate,
    enabled: period === "custom",
  });

  const isLoading = quickLoading || periodLoading;
  const stats = period === "custom" ? periodStats : quickStats;

  if (isLoading) {
    return (
      <div className={`grid ${compact ? "grid-cols-2" : "grid-cols-4"} gap-4`}>
        {[...Array(compact ? 2 : 4)].map((_, i) => (
          <Card key={i} className="rounded-2xl border-none shadow-sm">
            <CardContent className="p-4">
              <div className="space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-1 w-8" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      label: "Lịch hẹn",
      value: stats?.totalBookings || 0,
      icon: Calendar,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      label: "Chờ xác nhận",
      value: stats?.pendingCount || 0,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
    {
      label: "Đã hoàn thành",
      value: stats?.completedCount || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-100",
    },
    {
      label: "Doanh thu",
      value: `${stats?.totalRevenue.toLocaleString() || 0} đ`,
      icon: DollarSign,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
    },
    ...(compact
      ? []
      : [
          {
            label: "Approved",
            value: stats?.approvedCount || 0,
            icon: Users,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-100",
          },
          {
            label: "Cancelled",
            value: stats?.cancelledCount || 0,
            icon: XCircle,
            color: "text-rose-600",
            bg: "bg-rose-50",
            border: "border-rose-100",
          },
        ]),
  ];

  return (
    <div
      className={`grid ${compact ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"} gap-4`}
    >
      {statItems.map((item, index) => (
        <Card
          key={index}
          className={cn(
            "rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden bg-white",
            item.border,
          )}
        >
          <CardContent className="p-5">
            {/* Top Row: Icon (Left) and Label (Right) */}
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-xl shrink-0", item.bg)}>
                <item.icon className={cn("w-4 h-4", item.color)} />
              </div>

              <span className="text-[13px] font-black uppercase tracking-widest text-slate-400">
                {item.label}
              </span>
            </div>

            {/* Value Section */}
            <div className="space-y-1">
              <p className="text-2xl font-black text-slate-900 tracking-tighter text-center">
                {item.value}
              </p>

              {/* Decorative bar - now left-aligned to match the value and icon start */}
              <div className={cn("h-1 w-8 rounded-full", item.bg)} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickStats;
