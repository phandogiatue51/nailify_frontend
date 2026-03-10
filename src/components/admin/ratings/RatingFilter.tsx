import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingFilterProps {
    selectedRating?: number;
    showRatedOnly: boolean;
    onRatingChange: (rating?: number) => void;
    onShowRatedOnlyChange: (value: boolean) => void;
    onReset: () => void;
}

export const RatingFilter = ({
    selectedRating,
    showRatedOnly,
    onRatingChange,
    onReset,
}: RatingFilterProps) => {
    const hasActiveFilters = selectedRating !== undefined;

    return (
        <Card className="border-2 border-slate-100 rounded-3xl shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex flex-col gap-2">

                        <div className="flex flex-wrap items-center gap-3">
                            {[5, 4, 3, 2, 1].map((rating) => {
                                const isActive = selectedRating === rating;
                                return (
                                    <button
                                        key={rating}
                                        onClick={() => onRatingChange(isActive ? undefined : rating)}
                                        className={cn(
                                            "group flex items-center gap-2 px-4 py-2 rounded-2xl transition-all border-2",
                                            isActive
                                                ? "bg-[#950101] border-[#950101] text-white shadow-md shadow-red-100"
                                                : "bg-white border-slate-100 text-slate-600 hover:border-red-200 hover:bg-red-50"
                                        )}
                                    >
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={cn(
                                                        "w-4 h-4",
                                                        i < rating
                                                            ? (isActive ? "fill-white text-white" : "fill-amber-400 text-amber-400")
                                                            : (isActive ? "text-red-800" : "text-slate-200")
                                                    )}
                                                />
                                            ))}
                                        </div>
                                        <span className={cn(
                                            "text-sm font-black",
                                            isActive ? "text-white" : "text-slate-500"
                                        )}>
                                            {rating} star(s)
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            onClick={onReset}
                            className="h-12 px-6 rounded-2xl font-bold text-[#950101] hover:bg-red-50"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Xóa lọc
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default RatingFilter;