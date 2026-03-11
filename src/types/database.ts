export type UserRole = 0 | 1 | 2 | 3 | 4; // 0: Customer, 1: Shop Owner, 2: Admin, 3: Staff, 4: Nail Artist
export type ComponentType = 0 | 1 | 2 | 3 | 4; // 0: Form, 1: Base, 2: Shape, 3: Polish, 4: Design
export type BookingStatus = 0 | 1 | 2 | 3 | 4; // 0: Pending, 1: Approved, 2: Rejected, 3: Completed, 4: Cancelled
export type ReactionType = 0 | 1 | 2 | 3 | 4 | 5; // 0: Like, 1: Love, 2: Care, 3: Wow, 4: Sad, 5: Angry
export type SubscriptionStatus = 0 | 1 | 2 | 3; // 0: Active, 1: Expired, 2: Cancelled, 3: Pending
export type SubscriptionTier = 0 | 1 | 2 | 3; // 0: Free, 1: Basic, 2: Premium, 3: Business
export type InvoiceStatus = 0 | 1 | 2 | 3; // 0: Pending, 1: Paid, 2: Overdue, 3: Cancelled

import { TagDto } from "./type";

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  address: string | null;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isVerified: boolean;
  shopVerified: boolean | null;
  artistVerified: boolean | null;
  EmailVerificationToken: string;
  PasswordResetToken: string;
}

export interface NailArtist {
  id: string;
  profileId: string;
  fullName: string;
  email: string;
  phone: string | null;
  address: string | null;
  avatarUrl: string | null;
  role: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isVerified: boolean;
  rating?: number;
  artistId?: string | null;
  artistVerified?: boolean;
  serviceItems?: ServiceItem[];
  collections?: Collection[];
  bookings?: Booking[];
}

export interface Shop {
  id: string;
  ownerId: string;
  name: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  locations: Location[];
}

export interface Location {
  id: string;
  address: string;
  city?: string | null;
  phone?: string | null;
  openingTime?: string | null;
  closingTime?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  maxConcurrentBookings?: number | null;
  bufferMinutes?: number | null;
  bookingLeadTimeMinutes?: number | null;
  bookingWindowDays?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface ShopLocation {
  shopLocationId: string;
  shopName: string | null;
  address: string;
  city?: string | null;
  phone?: string | null;
  openingTime?: string | null;
  closingTime?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  maxConcurrentBookings?: number | null;
  bufferMinutes?: number | null;
  bookingLeadTimeMinutes?: number | null;
  bookingWindowDays?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface ServiceItem {
  id: string;
  shopId: string | null;
  nailArtistId: string | null;
  componentType: ComponentType;
  name: string;
  description: string | null;
  estimatedDuration: number;
  price: number;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionItemDto {
  id: string;
  serviceItemId: string;
  serviceItemName?: string;
  serviceItemPrice?: number;
  serviceItemImageUrl?: string | null;
}

export interface Collection {
  id: string;
  shopId: string | null;
  nailArtistId: string | null;
  name: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  estimatedDuration: number;
  calculatedDuration: number;
  createdAt: string;
  updatedAt: string;
  items?: CollectionItemDto[];
  tags?: TagDto[];
  totalPrice?: number;
}

export interface CollectionItem {
  id: string;
  collectionId: string;
  serviceItemId: string;
  createdAt: string;
  serviceItem?: ServiceItem;
}

export interface Booking {
  id: string;
  shopId: string;
  shopLocationId: string;
  shopName: string;
  nailArtistId: string;
  nailArtistName: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  address: string | null;
  city: string | null;
  collectionId: string | null;
  scheduledStart: string;
  scheduledEnd: string;
  ratings: number | null;
  comment: string | null;
  status: BookingStatus;
  totalPrice: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  shop?: Shop;
  customer?: Profile;
  items?: BookingItem[];
}

export interface BookingItem {
  id: string;
  bookingId: string;
  serviceItemId: string;
  price: number;
  createdAt: string;
  serviceItem?: ServiceItem;
}

export interface ShopLocationCreateDto {
  address: string;
  city?: string;
  phone?: string;
  openingTime?: string;
  closingTime?: string;
  latitude?: number;
  longitude?: number;
  maxConcurrentBookings?: number;
  bufferMinutes?: number;
  bookingLeadTimeMinutes?: number;
  bookingWindowDays?: number;
}

export interface StaffViewDto {
  staffId: string;
  email?: string;
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  shopLocationId: string;
  dddress?: string;
  isActive: boolean;
  createdAt: string;
}

export interface StaffCreateDto {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  shopLocationId: string;
}

export interface StaffUpdateDto extends ProfileUpdateDto {
  shopLocationId?: string;
}

export interface ProfileUpdateDto {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface DashboardStats {
  totalBookings: number;
  pendingCount: number;
  approvedCount: number;
  completedCount: number;
  cancelledCount?: number;
  rejectedCount?: number;
  totalRevenue: number;
  statusDistribution?: Record<string, number>;
  dayOfWeekDistribution?: Record<string, number>;
  period?: string;
}

export interface QuickStats {
  totalBookings: number;
  pendingCount: number;
  approvedCount: number;
  completedCount: number;
  cancelledCount: number;
  rejectedCount: number;
  totalRevenue: number;
}

export interface UseDashboardOptions {
  shopId?: string;
  artistId?: string;
  shopLocationId?: string;
  startDate?: string;
  endDate?: string;
  enabled?: boolean;
}

export interface RatingSummaryDto {
  averageRating: number;
  totalRatings: number;
  last30DaysRatings: number;
  last30DaysAverage: number;
  ratingDistribution: Record<number, number>; // { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 }

  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
}

export interface RatingCreateDto {
  rating: number; // 1-5 scale
  comment?: string | null;
}

export interface AdminRatingDashboardDto {
  entityType: string; // "Shop", "ShopLocation", "NailArtist", "Platform"
  entityName: string;
  summary: RatingSummaryDto;
  period: PeriodDto;
}

export interface PeriodDto {
  fromDate: string; // ISO date string from C# DateTime
  toDate: string; // ISO date string from C# DateTime
  label: string;
}

export interface BlogPost {
  id: string;
  title?: string;
  content: string;
  imageUrls?: string[];
  createdAt: string;
  nailArtistId?: string;
  shopId?: string;
  profileId: string;
  role: number;
  authorName: string;
  authorAvatarUrl: string | null;
  totalReactions: number;
  totalComments: number;
  myReaction?: Reaction | null;
  reactions?: Reaction[];
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  profileId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  parentCommentId: string | null;
  reactions: Reaction[];
  replies: Comment[];
}

export interface Reaction {
  id: string;
  profileId: string;
  reactorName: string;
  reactorAvatarUrl: string | null;
  type: ReactionType;
  reactedAt: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  fullName?: string | null;
  phone?: string | null;
  email?: string | null;
  subscriptionPlanId: string;
  planName?: string | null;
  startDate: string;
  endDate?: string | null;
  status: SubscriptionStatus;
  isActive: boolean;
  isExpired: boolean;
  daysRemaining?: number | null;
}

export interface Subscription {
  id: string;
  imageUrl?: string | null;
  name: string | null;
  description: string | null;
  price?: number | null;
  iconUrl?: string | null;
  colorHex?: string | null;
  maxPostsPerDay?: number | null;
  maxImagesPerPost?: number | null;
  maxServices?: number | null;
  maxCollections?: number | null;
  tier?: SubscriptionTier | null;
  durationDays?: number | null;
}

export interface Invoice {
  id: string;
  issuedAt: string;
  dueDate?: string;

  totalAmount: number;
  amountPaid?: number;
  paidAt?: string;

  status: InvoiceStatus;
  orderCode?: number;
  userId: string;
  fullName?: string;
  phone?: string;
  email?: string;

  userSubscriptionId?: string;
  tier: SubscriptionTier;
  subscriptionPlanId: string;
  planName?: string;
  startDate?: string;
  endDate?: string;
}

export interface FourWidgetDto {
  totalRevenue: number;
  totalUsers: number;
  totalInvoices: number;
  totalRates: number;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface DashboardData {
  widgets: FourWidgetDto | undefined;
  topShops: ChartPoint[] | undefined;
  topArtists: ChartPoint[] | undefined;
  customerGrowth: ChartPoint[] | undefined;
  ratingsBreakdown: ChartPoint[] | undefined;
}

export interface DashboardState {
  data: DashboardData;
  isLoading: boolean;
  isError: boolean;
  errors: Array<Error | null>;
  refetchAll: () => void;
}

export interface BookRateStats {
  totalBookings: number;
  averageRating?: number;
}
