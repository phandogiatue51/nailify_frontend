// components/ui/pagination-mobile.tsx
import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface MobilePaginationProps extends React.ComponentProps<"nav"> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  visibleItems?: number;
  totalItems?: number;
}

export function MobilePagination({
  className,
  currentPage,
  totalPages,
  onPageChange,
  showInfo = true,
  visibleItems,
  totalItems,
  ...props
}: MobilePaginationProps) {
  // Generate simplified page numbers for mobile
  const getMobilePageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "ellipsis", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        "ellipsis",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "ellipsis",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "ellipsis",
      totalPages,
    ];
  };

  const pageNumbers = getMobilePageNumbers();

  return (
    <div className="space-y-4">
      {/* Mobile Info Bar - Sticky at bottom */}
      {showInfo && totalItems && (
        <div className="flex items-center justify-between text-xs text-slate-500 px-4 py-2 bg-white/90 backdrop-blur-sm border-t border-slate-100">
          <span className="font-bold text-slate-500">
            Đang hiển thị {visibleItems} trên tổng {totalItems}
          </span>
          <span className="font-bold text-slate-500">
            Trang {currentPage} trong tổng số trang {totalPages}
          </span>
        </div>
      )}

      {/* Mobile Pagination Controls */}
      <nav
        role="navigation"
        aria-label="pagination"
        className={cn("flex items-center justify-between px-4", className)}
        {...props}
      >
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "flex items-center gap-1 px-3 py-2 text-sm rounded-xl",
            currentPage === 1 && "opacity-50 pointer-events-none",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </button>

        {/* Page Numbers - Compact view */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((pageNum, index) =>
            pageNum === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                className="flex h-8 w-8 items-center justify-center"
              >
                <MoreHorizontal className="h-4 w-4 text-slate-400" />
              </span>
            ) : (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum as number)}
                className={cn(
                  "h-8 w-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all",
                  currentPage === pageNum
                    ? "bg-[#E288F9] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100",
                )}
              >
                {pageNum}
              </button>
            ),
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "flex items-center gap-1 px-3 py-2 text-sm rounded-xl",
            currentPage === totalPages && "opacity-50 pointer-events-none",
          )}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
}
