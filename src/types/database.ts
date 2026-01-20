export type UserRole = 0 | 1 | 2; // 0: Customer, 1: Shop Owner, 2: Admin
export type ComponentType = 0 | 1 | 2 | 3 | 4; // 0: Form, 1: Base, 2: Shape, 3: Polish, 4: Design
export type BookingStatus = 0 | 1 | 2 | 3 | 4; // 0: Pending, 1: Approved, 2: Rejected, 3: Completed, 4: Cancelled

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface Shop {
  id: string;
  ownerId: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceItem {
  id: string;
  shopId: string;
  componentType: ComponentType;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  shopId: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  estimatedDuration: number;
  createdAt: string;
  updatedAt: string;
  items?: ServiceItem[];
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
  customerId: string;
  collectionId: string | null;
  bookingDate: string;
  bookingTime: string;
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