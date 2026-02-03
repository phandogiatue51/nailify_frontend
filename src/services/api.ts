import { TagDto } from "@/types/type";
import {
  ProfileFilter,
  ShopFilterDto,
  ServiceItemFilterDto,
  CollectionFilterDto,
  ArtistFilterDto,
} from "@/types/filter";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean;
  headers?: Record<string, string>;
  timeout?: number;
}

const fetchWithTimeout = async (
  url: string,
  options: RequestInit & { timeout?: number } = {},
): Promise<Response> => {
  const { timeout = 30000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

const apiRequest = async <T = any>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    accept: "application/json",
    ...options.headers,
  };

  if (options.body && !(options.body instanceof FormData)) {
    if (!headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }
  }

  let token: string | null = null;
  if (typeof window !== "undefined" && !options.skipAuth) {
    token =
      localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    method: options.method || "GET",
    headers,
    ...options,
  };

  if (options.body && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetchWithTimeout(url, {
      ...config,
      timeout: options.timeout || 30000,
    });

    if (!response.ok) {
      const errorText = await response.text();

      let errorMessage = `Error ${response.status}`;

      if (errorText) {
        try {
          const data = JSON.parse(errorText);
          errorMessage = data.message;
        } catch {
          errorMessage = errorText;
        }
      }

      console.log("DEBUG: About to throw error:", errorMessage);
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    try {
      const data = await response.json();
      return data;
    } catch (e) {
      console.warn("Failed to parse JSON response:", e);
      return null as T;
    }
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

export const authAPI = {
  login: (loginData: any) =>
    apiRequest("/Auth/login", {
      method: "POST",
      body: loginData,
    }),

  signUp: (userData: any) =>
    apiRequest("/Auth/signup", {
      method: "POST",
      body: userData,
    }),
};

export const profileAPI = {
  getAll: () => apiRequest("/Profile"),

  getById: (id: any) => apiRequest(`/Profile/${id}`),

  updateProfile: (formData: FormData) =>
    apiRequest(`/Profile/`, {
      method: "PUT",
      body: formData,
    }),

  changeStatus: (id: any) =>
    apiRequest(`/Profile/change-status/${id}`, {
      method: "PUT",
    }),

  changePassword: (passwordData: any) =>
    apiRequest(`/Profile/change-password/`, {
      method: "PUT",
      body: passwordData,
    }),

  getProfile: () => apiRequest("/Profile/user-profile"),

  filterProfiles: (filter: ProfileFilter) => {
    const queryParams = new URLSearchParams();
    if (filter.SearchTerm !== undefined) {
      queryParams.append("SearchTerm", filter.SearchTerm);
    }
    if (filter.Role !== undefined) {
      queryParams.append("Role", filter.Role.toString());
    }
    if (filter.IsActive !== undefined) {
      queryParams.append("IsActive", filter.IsActive.toString());
    }

    return apiRequest(`/Profile/filter?${queryParams.toString()}`);
  },
};

export const collectionAPI = {
  getAll: () => apiRequest("/Collection"),

  getById: (id: string) => apiRequest(`/Collection/${id}`),

  getByShop: (shopId: string) => apiRequest(`/Collection/shop/${shopId}`),

  getByShopAuth: () => apiRequest("/Collection/shopAuth"),

  getByArtist: (artistId: string) =>
    apiRequest(`/Collection/artist/${artistId}`),
  getByArtistAuth: () => apiRequest("/Collection/artistAuth"),

  createShopCollection: (formData: FormData) =>
    apiRequest("/Collection/shop", {
      method: "POST",
      body: formData,
    }),

  createArtistCollection: (formData: FormData) =>
    apiRequest("/Collection/artist", {
      method: "POST",
      body: formData,
    }),

  updateCollection: (id: string, formData: FormData) =>
    apiRequest(`/Collection/${id}`, {
      method: "PUT",
      body: formData,
    }),

  deleteCollection: (id: string) =>
    apiRequest(`/Collection/${id}`, {
      method: "DELETE",
    }),

  adminFilter: (filterParams: CollectionFilterDto) => {
    const queryParams = new URLSearchParams();

    Object.entries(filterParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const url = queryString
      ? `/Collection/admin-filter?${queryString}`
      : "/Collection/admin-filter";

    return apiRequest(url);
  },

  customerFilter: (filterParams: CollectionFilterDto) => {
    const queryParams = new URLSearchParams();

    Object.entries(filterParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const url = queryString
      ? `/Collection/customer-filter?${queryString}`
      : "/Collection/customer-filter";

    return apiRequest(url);
  },
};

export const shopAPI = {
  getAll: () => apiRequest("/Shop"),

  getById: (id: string) => apiRequest(`/Shop/${id}`),

  getMyShops: () => apiRequest("/Shop/owner"),

  createShop: (formData: FormData) =>
    apiRequest("/Shop", {
      method: "POST",
      body: formData,
    }),

  updateShop: (formData: FormData) =>
    apiRequest(`/Shop`, {
      method: "PUT",
      body: formData,
    }),

  verifyShop: (id: string) =>
    apiRequest(`/Shop/verify/${id}`, {
      method: "PUT",
    }),

  adminFilter: (filterParams: ShopFilterDto) => {
    const queryParams = new URLSearchParams();

    Object.entries(filterParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const url = queryString
      ? `/Shop/admin-filter?${queryString}`
      : "/Shop/admin-filter";

    return apiRequest(url);
  },

  customerFilter: (filterParams: ShopFilterDto) => {
    const queryParams = new URLSearchParams();

    Object.entries(filterParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const url = queryString
      ? `/Shop/customer-filter?${queryString}`
      : "/Shop/customer-filter";

    return apiRequest(url);
  },
};

export const serviceItemAPI = {
  getAll: () => apiRequest("/ServiceItem"),

  getById: (id: string) => apiRequest(`/ServiceItem/${id}`),

  getByShop: (shopId: string) => apiRequest(`/ServiceItem/shop/${shopId}`),

  getByShopAuth: () => apiRequest("/ServiceItem/shopAuth"),

  getByArtist: (artistId: string) =>
    apiRequest(`/ServiceItem/artist/${artistId}`),

  getByArtistAuth: () => apiRequest("/ServiceItem/artistAuth"),

  createShopServiceItem: (formData: FormData) =>
    apiRequest("/ServiceItem/shop", {
      method: "POST",
      body: formData,
    }),

  createArtistServiceItem: (formData: FormData) =>
    apiRequest("/ServiceItem/artist", {
      method: "POST",
      body: formData,
    }),

  updateServiceItem: (id: string, formData: FormData) =>
    apiRequest(`/ServiceItem/${id}`, {
      method: "PUT",
      body: formData,
    }),

  deleteServiceItem: (id: string) =>
    apiRequest(`/ServiceItem/${id}`, {
      method: "DELETE",
    }),

  adminFilter: (filterParams: ServiceItemFilterDto) => {
    const queryParams = new URLSearchParams();

    Object.entries(filterParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const url = queryString
      ? `/ServiceItem/admin-filter?${queryString}`
      : "/ServiceItem/admin-filter";

    return apiRequest(url);
  },

  customerFilter: (filterParams: ServiceItemFilterDto) => {
    const queryParams = new URLSearchParams();

    Object.entries(filterParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const url = queryString
      ? `/ServiceItem/customer-filter?${queryString}`
      : "/ServiceItem/customer-filter";

    return apiRequest(url);
  },
};

export const BookingAPI = {
  getAll: () => apiRequest("/Booking"),

  getById: (id: string) => apiRequest(`/Booking/${id}`),

  getByShop: (shopId: string) => apiRequest(`/Booking/shop/${shopId}`),
  getByShopAuth: () => apiRequest("/Booking/shopAuth"),

  getByLocation: (shopLocationId: string) =>
    apiRequest(`/Booking/location/${shopLocationId}`),

  getByArtist: (shopId: string) => apiRequest(`/Booking/artist/${shopId}`),
  getByArtistAuth: () => apiRequest("/Booking/artistAuth"),

  getByCustomer: (customerId: string) =>
    apiRequest(`/Booking/customer/${customerId}`),

  getSummary: (dto: any) =>
    apiRequest("/Booking/calculate", {
      method: "POST",
      body: dto,
    }),

  createUserBooking: (dto: any) =>
    apiRequest("/Booking/customer-booking", {
      method: "POST",
      body: dto,
    }),

  createArtistBooking: (dto: any) =>
    apiRequest("/Booking/artist-booking", {
      method: "POST",
      body: dto,
    }),

  createShopBooking: (dto: any) =>
    apiRequest("/Booking/shop-booking", {
      method: "POST",
      body: dto,
    }),

  updateStatus: (id: string, status: any) =>
    apiRequest(`/Booking/update-status/${id}`, {
      method: "PUT",
      body: status,
    }),

  filter: (filterParams: {
    ShopId?: string;
    ShopLocationId?: string;
    CustomerId?: string;
    StaffId?: string;
    Name?: string;
    EstimatedDuration?: number;
    Category?: number;
    TagId?: string;
  }) => {
    const queryParams = new URLSearchParams();

    Object.entries(filterParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const url = queryString
      ? `/Booking/filter?${queryString}`
      : "/Booking/filter";

    return apiRequest(url);
  },
};

export const LocationAPI = {
  getByShopAuth: () => apiRequest(`/Location/get-location-auth`),

  getById: (id: string) =>
    apiRequest(`/Location/${id}`, {
      method: "GET",
    }),

  getByShop: (id: string) =>
    apiRequest(`/Location/get-location-from-shop/${id}`, {
      method: "GET",
    }),

  createLocation: (dto: any) =>
    apiRequest("/Location", {
      method: "POST",
      body: dto,
    }),

  updateLocation: (id: string, dto: any) =>
    apiRequest(`/Location/${id}`, {
      method: "PUT",
      body: dto,
    }),

  deleteLocation: (id: string) =>
    apiRequest(`/Location/${id}`, {
      method: "DELETE",
    }),
};

export const emailAPI = {
  sendVerification: (dto: any) =>
    apiRequest("/Email/send-verification", {
      method: "POST",
      body: dto,
    }),

  sendPasswordReset: (dto: any) =>
    apiRequest("/Email/send-password-reset", {
      method: "POST",
      body: dto,
    }),

  verify: (token: string) =>
    apiRequest(`/Email/verify?token=${encodeURIComponent(token)}`, {
      method: "GET",
    }),

  resetPassword: (dto: any) =>
    apiRequest("/Email/reset-password", {
      method: "POST",
      body: dto,
    }),

  checkResetToken: (token: string) =>
    apiRequest(`/Email/check-reset-token?token=${encodeURIComponent(token)}`, {
      method: "GET",
    }),
};

export const tagAPI = {
  getAllTags: (): Promise<TagDto[]> =>
    apiRequest("/Tag", {
      method: "GET",
    }),

  getTagsByCategory: (category: number): Promise<TagDto[]> =>
    apiRequest(`/Tag/category?tagCategory=${encodeURIComponent(category)}`, {
      method: "GET",
    }),
};

export const artistAPI = {
  getAll: () => apiRequest("/Artist"),

  getById: (artistId: string) => apiRequest(`/Artist/${artistId}`),

  getByAuth: () => apiRequest("/Artist/artistAuth"),

  createArtist: () =>
    apiRequest("/Artist", {
      method: "POST",
    }),

  verifyArtist: (artistId: string) =>
    apiRequest(`/Artist/verify/${artistId}`, {
      method: "PUT",
    }),

  adminFilter: (filterParams: ArtistFilterDto) => {
    const queryParams = new URLSearchParams();

    Object.entries(filterParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const url = queryString
      ? `/Artist/admin-filter?${queryString}`
      : "/Artist/admin-filter";

    return apiRequest(url);
  },

  customerFilter: (filterParams: ArtistFilterDto) => {
    const queryParams = new URLSearchParams();

    Object.entries(filterParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const url = queryString
      ? `/Artist/customer-filter?${queryString}`
      : "/Artist/customer-filter";

    return apiRequest(url);
  },
};

export default apiRequest;
