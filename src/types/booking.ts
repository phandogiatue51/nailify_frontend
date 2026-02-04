export interface BaseBookingCreateDto {
  collectionId?: string | null;
  bookingItems?: BookingItemCreateDto[] | null;
  scheduledStart: string;
  notes?: string | null;
}

export interface BookingItemCreateDto {
  serviceItemId: string;
}

export interface ArtistBookingCreateDto extends BaseBookingCreateDto {
  customerId?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  address?: string | null;
}

export interface CustomerBookingCreateDto extends BaseBookingCreateDto {
  shopLocationId?: string | null;
  nailArtistId?: string | null;
}

export interface ShopBookingCreateDto extends BaseBookingCreateDto {
  shopLocationId: string;
  customerId?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
}

export enum BookingType {
  CustomerBooking = "CustomerBooking",
  ArtistBooking = "ArtistBooking",
  ShopBooking = "ShopBooking",
}

export enum BookingStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
  Completed = "Completed",
  Cancelled = "Cancelled",
}

export interface BookingResponse {
  success: boolean;
  message: string;
  bookingId?: string | null;
}

export interface BookingViewDto {
  id: string;
  shopLocationId?: string | null;
  nailArtistId?: string | null;
  customerId?: string | null;
  customerName: string;
  customerPhone: string;
  customerAddress?: string | null;
  collectionId?: string | null;
  collectionName: string;
  scheduledStart: string;
  scheduledEnd: string;
  durationMinutes: number;
  totalPrice: number;
  notes?: string | null;
  status: BookingStatus;
  bookingItems: BookingItemViewDto[];
}

export interface BookingItemViewDto {
  id: string;
  serviceItemId: string;
  serviceItemName: string;
  price: number;
}

export interface BookingCalculateDto {
  collectionId?: string | null;
  serviceItemIds?: string[] | null;
  previewDate?: string | null;
  shopLocationId?: string | null;
  nailArtistId?: string | null;
}

export interface BookingUpdateDto {
  collectionId?: string | null;
  bookingItems?: BookingItemCreateDto[] | null;
  scheduledStart?: string | null;
  notes?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  customerAddress?: string | null | null;
}

export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6
}

export interface CreateBookingParams {
  shopId?: string;
  shopLocationId?: string;
  nailArtistId?: string;
  bookingDate: string;
  bookingTime: string;
  notes?: string;
  collectionId?: string;
  items?: { serviceItemId: string }[];
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  bookingType: "CustomerBooking" | "ArtistBooking" | "ShopBooking";
}

export interface UpdateBookingParams {
  id: string;
  data: {
    collectionId?: string | null;
    bookingItems?: { serviceItemId: string }[] | null;
    scheduledStart?: string | null;
    notes?: string | null;
    customerName?: string | null;
    customerPhone?: string | null;
    customerAddress?: string | null;
  };
}

export interface BookingStats {
  totalBookings: number;
  pendingCount: number;
  approvedCount: number;
  completedCount: number;
  cancelledCount: number;
  rejectedCount: number;
  totalRevenue: number;
  statusDistribution: Record<BookingStatus, number>;
  dayOfWeekDistribution: Record<DayOfWeek, number>;
}
