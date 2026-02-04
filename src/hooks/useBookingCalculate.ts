// hooks/useBookingCalculate.ts - UPDATED
import { useQuery } from "@tanstack/react-query";
import { BookingCalculateDto } from "@/types/booking";
import { BookingAPI } from "@/services/api";

interface BookingCalculation {
  totalPrice: number;
  totalDuration: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    estimatedDuration: number;
  }>;
  collection?: {
    id: string;
    name: string;
    totalPrice: number;
    estimatedDuration: number;
    description?: string;
    imageUrl?: string;
  };
}

export const useBookingCalculate = (dto: BookingCalculateDto) => {
  const hasCollection = dto.collectionId && dto.collectionId !== "null";
  const hasServiceItems = dto.serviceItemIds && dto.serviceItemIds.length > 0;
  const hasPreviewDate = !!dto.previewDate;

  return useQuery<BookingCalculation>({
    queryKey: ["booking-calculation", dto],
    queryFn: async () => {
      const response = await BookingAPI.getSummary(dto);
      return response;
    },
    enabled: (hasCollection || hasServiceItems) && hasPreviewDate, // ← Require previewDate!
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1, // Only retry once on failure
  });
};
