export enum UserRole {
  Customer,
  ShopOwner,
  Admin,
  Staff,
  NailArtist,
}

export enum ComponentType {
  Form,
  Base,
  Shape,
  Polish,
  Design,
}

export enum TagCategory {
  Occasion,
  Season,
  Style,
}

export interface ProfileFilter {
  SearchTerm?: string;
  Role?: UserRole;
  IsActive?: boolean;
}

export interface ShopFilterDto {
  Name?: string;
  Rating?: number;
  IsActive?: boolean;
  IsVerified?: boolean;
}

export interface ServiceItemFilterDto {
  ShopId?: string;
  NailArtistId?: string;
  SearchTerm?: string;
  IsActive?: boolean;
  ComponentType?: ComponentType;
}

export interface CollectionFilterDto {
  ShopId?: string;
  ArtistId?: string;
  Name?: string;
  Category?: TagCategory;
  TagId?: string;
  isActive?: boolean;
}

export interface ArtistFilterDto {
  Rating?: number;
  SearchTerm?: string;
  IsVerified?: boolean;
}
