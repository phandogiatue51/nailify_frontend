import { useMemo } from "react";

interface UsePaginationProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  maxVisiblePages?: number;
}

interface PaginationInfo {
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasPrevious: boolean;
  hasNext: boolean;
  pageNumbers: (number | "ellipsis")[];
  visibleItems: number;
}

export function usePagination({
  totalItems,
  pageSize,
  currentPage,
  maxVisiblePages = 5,
}: UsePaginationProps): PaginationInfo {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages));

  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const pageNumbers = useMemo(() => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, safeCurrentPage - halfVisible);
    let endPage = Math.min(totalPages, safeCurrentPage + halfVisible);

    if (safeCurrentPage <= halfVisible) {
      endPage = maxVisiblePages;
    }

    if (safeCurrentPage > totalPages - halfVisible) {
      startPage = totalPages - maxVisiblePages + 1;
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("ellipsis");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("ellipsis");
      }
      pages.push(totalPages);
    }

    return pages;
  }, [totalPages, safeCurrentPage, maxVisiblePages]);

  return {
    totalPages,
    startIndex,
    endIndex,
    hasPrevious: safeCurrentPage > 1,
    hasNext: safeCurrentPage < totalPages,
    pageNumbers,
    visibleItems: Math.min(pageSize, totalItems - startIndex),
  };
}
