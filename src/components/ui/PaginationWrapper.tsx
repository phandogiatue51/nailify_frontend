import { ReactNode } from "react";
import { usePagination } from "@/hooks/usePagination";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginationWrapperProps<T> {
  items: T[];
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  renderItem: (item: T) => ReactNode;
  showInfo?: boolean;
  gridClassName?: string;
}

export function PaginationWrapper<T>({
  items,
  currentPage,
  pageSize,
  onPageChange,
  renderItem,
  showInfo = true,
  gridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
}: PaginationWrapperProps<T>) {
  const pagination = usePagination({
    totalItems: items.length,
    pageSize,
    currentPage,
  });

  const paginatedItems = items.slice(
    pagination.startIndex,
    pagination.endIndex,
  );

  return (
    <div className="space-y-6">
      {/* Results Info */}
      {showInfo && items.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Đang hiển thị {pagination.visibleItems} trên tổng {items.length}
        </div>
      )}

      {/* Items Grid/List */}
      <div className={gridClassName}>
        {paginatedItems.map((item, index) => (
          <div key={index}>{renderItem(item)}</div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {/* Previous Button */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(currentPage - 1)}
                className={
                  !pagination.hasPrevious
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {/* Page Numbers */}
            {pagination.pageNumbers.map((pageNum, index) => (
              <PaginationItem key={index}>
                {pageNum === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => onPageChange(pageNum as number)}
                    isActive={currentPage === pageNum}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            {/* Next Button */}
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(currentPage + 1)}
                className={
                  !pagination.hasNext
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
