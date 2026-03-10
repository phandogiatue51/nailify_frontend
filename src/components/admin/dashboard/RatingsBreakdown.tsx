// components/RatingsBreakdown.tsx (if you have it)
import ChartWidget from "./ChartWidget";
import { useRatingsBreakdown } from "@/hooks/useAdmin";
import { Loader2 } from "lucide-react";

const RatingsBreakdown = () => {
    const { data, isLoading, error } = useRatingsBreakdown();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64 text-red-500">
                Không thể tải dữ liệu. Xin thử lại
            </div>
        );
    }

    return (
        <ChartWidget
            title="Tổng quan đánh giá"
            data={data || []}
            type="doughnut"
            horizontal={false}
            description="Mức độ đánh giá của khách hàng trong tháng này"
        />
    );
};

export default RatingsBreakdown;