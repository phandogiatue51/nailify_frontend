export interface ProfileBookingsTabsProps {
  profileId: string;
  shopId: string | null;
  nailArtistId: string | null;
  userRole?: number;
  userShopId?: string;
  userNailArtistId?: string;
}

export interface StaffCreateFormData {
  Email: string;
  Password: string;
  FullName: string;
  Phone?: string;
  ShopLocationId: string;
  avatar?: File;
}

export interface StaffUpdateFormData {
  FullName?: string;
  Email?: string;
  Phone?: string;
  Address?: string;
  ShopLocationId?: string;
  avatar?: File;
}