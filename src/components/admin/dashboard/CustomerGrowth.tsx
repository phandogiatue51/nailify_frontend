// components/CustomerGrowth.tsx (if you have it)
import ChartWidget from "./ChartWidget";
import { useCustomerGrowth } from "@/hooks/useAdmin";
import { Loader2 } from "lucide-react";

const CustomerGrowth = () => {
    const { data, isLoading, error } = useCustomerGrowth();

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
            title="Tăng trưởng cộng đồng"
            data={data || []}
            type="line"
            horizontal={false}
            description="Biểu đồ thể hiện lượng người dùng mới đăng ký."
        />
    );
};

export default CustomerGrowth;