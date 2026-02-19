export type UserRole = 'customer' | 'shop_owner';
export type ComponentType = 'base' | 'shape' | 'polish' | 'design' | 'gem';
export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  user_type: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Shop {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  logo_url: string | null;
  cover_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceItem {
  id: string;
  shop_id: string;
  component_type: ComponentType;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  shop_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  items?: ServiceItem[];
  total_price?: number;
}

export interface CollectionItem {
  id: string;
  collection_id: string;
  service_item_id: string;
  created_at: string;
  service_item?: ServiceItem;
}

export interface Booking {
  id: string;
  shop_id: string;
  customer_id: string;
  collection_id: string | null;
  booking_date: string;
  booking_time: string;
  status: BookingStatus;
  total_price: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  shop?: Shop;
  customer?: Profile;
  items?: BookingItem[];
}

export interface BookingItem {
  id: string;
  booking_id: string;
  service_item_id: string;
  price: number;
  created_at: string;
  service_item?: ServiceItem;
}
