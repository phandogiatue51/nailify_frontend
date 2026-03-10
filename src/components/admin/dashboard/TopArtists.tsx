// components/TopArtists.tsx
import ChartWidget from "./ChartWidget";
import { useTopArtists } from "@/hooks/useAdmin";
import { Loader2 } from "lucide-react";

const TopArtists = () => {
    const { data, isLoading, error } = useTopArtists();

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
            title="Thợ Nail tiêu biểu"
            data={data || []}
            type="bar"
            horizontal={false}
            description="Xếp hạng dựa trên tổng doanh thu và số lượng đơn hàng hoàn tất trong tháng này."
        />
    );
};

export default TopArtists;