// pages/admin/ratings/components/RatingList.tsx
import { useState, useEffect } from "react";
import { useBookings } from "@/hooks/useBookings";
import BookingCard from "@/components/booking/BookingCard";
import { Booking } from "@/types/database";
import { Loader2, Star } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { PaginationWrapper } from "@/components/ui/PaginationWrapper";

interface RatingListProps {
    title?: string;
    selectedRating?: number;
    showRatedOnly: boolean;
}

const RatingList: React.FC<RatingListProps> = ({
    title = "Đánh giá từ khách hàng",
    selectedRating,
    showRatedOnly,
}) => {
    const { filterBookings } = useBookings();
    const queryClient = useQueryClient();
    const [currentFilters, setCurrentFilters] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const filters: any = {
            Status: 3, // Completed bookings only
            HasRating: showRatedOnly,
        };

        if (selectedRating) {
            filters.Rating = selectedRating;
        }

        setCurrentFilters(filters);
        filterBookings.mutate(filters);
        setCurrentPage(1);
    }, [selectedRating, showRatedOnly]);

    const bookings = currentFilters
        ? queryClient.getQueryData<Booking[]>(["filteredBookings", currentFilters])
        : [];
    const isLoading = filterBookings.isPending;

    // Calculate stats
    const totalBookings = bookings?.length || 0;
    const averageRating = bookings?.reduce((acc, b) => acc + (b.ratings || 0), 0) / (bookings?.filter(b => b.ratings).length || 1) || 0;

    return (
        <div className="space-y-6">
            {/* Header with title and stats */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black tracking-tight">{title} • Trung bình {averageRating.toFixed(1)}/5</h2>
                </div>
            </div>

            {/* Results with PaginationWrapper */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
                </div>
            ) : !bookings || bookings.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    <Star className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <p className="text-sm font-bold text-slate-400">
                        Không tìm thấy đánh giá nào
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                        Thử điều chỉnh bộ lọc của bạn
                    </p>
                </div>
            ) : (
                <PaginationWrapper
                    items={bookings}
                    currentPage={currentPage}
                    pageSize={10}
                    onPageChange={setCurrentPage}
                    renderItem={(booking) => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            isAdmin={true}
                        />
                    )}
                    gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                />
            )}
        </div>
    );
};

export default RatingList;