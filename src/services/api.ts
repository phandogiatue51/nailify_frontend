import { TagDto } from "@/types/type";
import {
  ProfileFilter,
  ShopFilterDto,
  ServiceItemFilterDto,
  CollectionFilterDto,
  ArtistFilterDto,
  BookingFilterDto,
  StaffFilterDto,
  RatingFilterDto,
  BlogPostFilterDto,
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
    const queryString = buildQuery(filter);
    const url = queryString
      ? `/Profile/filter?${queryString}`
      : "/Profile/filter";
    return apiRequest(url);
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
    const queryString = buildQuery(filterParams);
    const url = queryString
      ? `/Collection/admin-filter?${queryString}`
      : "/Collection/admin-filter";
    return apiRequest(url);
  },

  customerFilter: (filterParams?: CollectionFilterDto) => {
    const queryString = buildQuery(filterParams);
    const url = queryString
      ? `/Collection/customer-filter?${queryString}`
      : "/Collection/customer-filter";
    return apiRequest(url);
  },
};

export const shopAPI = {
  getAll: () => apiRequest("/Shop"),

  getById: (id: string) => apiRequest(`/Shop/${id}`),
  getByProfileId: (id: string) => apiRequest(`/Shop/profile/${id}`),

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
    const queryString = buildQuery(filterParams);
    const url = queryString
      ? `/Shop/admin-filter?${queryString}`
      : "/Shop/admin-filter";
    return apiRequest(url);
  },

  customerFilter: (filterParams: ShopFilterDto) => {
    const queryString = buildQuery(filterParams);
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
    const queryString = buildQuery(filterParams);
    const url = queryString
      ? `/ServiceItem/admin-filter?${queryString}`
      : "/ServiceItem/admin-filter";
    return apiRequest(url);
  },

  customerFilter: (filterParams: ServiceItemFilterDto) => {
    const queryString = buildQuery(filterParams);
    const url = queryString
      ? `/ServiceItem/customer-filter?${queryString}`
      : "/ServiceItem/customer-filter";
    return apiRequest(url);
  },
};

export const BookingAPI = {
  getAll: () => apiRequest("/Booking"),

  getById: (id: string) => apiRequest(`/Booking/${id}`),
  getByShop: (shopId: string, date?: Date) => {
    const url = date
      ? `/Booking/shop/${shopId}?date=${date.toISOString()}`
      : `/Booking/shop/${shopId}`;
    return apiRequest(url);
  },

  getByShopAuth: (date?: Date) => {
    const url = date
      ? `/Booking/shopAuth?date=${date.toISOString()}`
      : `/Booking/shopAuth`;
    return apiRequest(url);
  },

  getByLocation: (shopLocationId: string, date?: Date) => {
    const url = date
      ? `/Booking/location/${shopLocationId}?date=${date.toISOString()}`
      : `/Booking/location/${shopLocationId}`;
    return apiRequest(url);
  },

  getByLocationAuth: (date?: Date) => {
    const url = date
      ? `/Booking/locationAuth?date=${date.toISOString()}`
      : `/Booking/locationAuth`;
    return apiRequest(url);
  },

  getAvailableByLocation: (shopLocationId: string, date?: Date) => {
    const url = date
      ? `/Booking/location/available/${shopLocationId}?date=${date.toISOString()}`
      : `/Booking/location/available/${shopLocationId}`;

    return apiRequest(url);
  },

  getAvailableByArtist: (date?: Date) => {
    const url = date
      ? `/Booking/artist/available/?date=${date.toISOString()}`
      : `/Booking/artist/available`;
    return apiRequest(url);
  },

  getByArtist: (artistId: string, date?: Date) => {
    const url = date
      ? `/Booking/artist/${artistId}?date=${date.toISOString()}`
      : `/Booking/artist/${artistId}`;
    return apiRequest(url);
  },

  getByArtistAuth: (date?: Date) => {
    const url = date
      ? `/Booking/artistAuth?date=${date.toISOString()}`
      : `/Booking/artistAuth`;
    return apiRequest(url);
  },

  getByCustomer: (customerId: string, date?: Date) => {
    const url = date
      ? `/Booking/customer/${customerId}?date=${date.toISOString()}`
      : `/Booking/customer/${customerId}`;
    return apiRequest(url);
  },

  getByCustomerAuth: (date?: Date) => {
    const url = date
      ? `/Booking/customerAuth?date=${date.toISOString()}`
      : `/Booking/customerAuth`;
    return apiRequest(url);
  },

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

  updateBooking: (id: string, dto: any) =>
    apiRequest(`/Booking/${id}`, {
      method: "PUT",
      body: dto,
    }),

  cancelBooking: (id: string) =>
    apiRequest(`/Booking/${id}`, {
      method: "DELETE",
    }),

  updateStatus: (id: string, status: any) =>
    apiRequest(`/Booking/update-status/${id}?status=${status}`, {
      method: "PUT",
    }),

  filter: (filterParams: BookingFilterDto) => {
    const queryString = buildQuery(filterParams);
    const url = queryString
      ? `/Booking/filter?${queryString}`
      : "/Booking/filter";
    return apiRequest(url);
  },
};

export const LocationAPI = {
  getByShopAuth: () => apiRequest(`/Location/shop`),
  getByLocationAuth: () => apiRequest(`/Location/auth`),

  getById: (id: string) =>
    apiRequest(`/Location/${id}`, {
      method: "GET",
    }),

  getByShop: (id: string) =>
    apiRequest(`/Location/shop/${id}`, {
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
  getByProfileId: (id: string) => apiRequest(`/Artist/profile/${id}`),

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
    const queryString = buildQuery(filterParams);
    const url = queryString
      ? `/Artist/admin-filter?${queryString}`
      : "/Artist/admin-filter";
    return apiRequest(url);
  },

  customerFilter: (filterParams: ArtistFilterDto) => {
    const queryString = buildQuery(filterParams);
    const url = queryString
      ? `/Artist/customer-filter?${queryString}`
      : "/Artist/customer-filter";
    return apiRequest(url);
  },
};

export const dashboardAPI = {
  getByShop: (shopId: string, startDate?: string, endDate?: string) =>
    apiRequest(
      `/Dashboard/shop/${shopId}?${buildQuery({ startDate, endDate })}`,
    ),

  getByShopAuth: (startDate?: string, endDate?: string) =>
    apiRequest(`/Dashboard/shopAuth?${buildQuery({ startDate, endDate })}`),

  getByArtist: (artistId: string, startDate?: string, endDate?: string) =>
    apiRequest(
      `/Dashboard/artist/${artistId}?${buildQuery({ startDate, endDate })}`,
    ),

  getByArtistAuth: (startDate?: string, endDate?: string) =>
    apiRequest(`/Dashboard/artistAuth?${buildQuery({ startDate, endDate })}`),

  getByLocation: (
    shopLocationId: string,
    startDate?: string,
    endDate?: string,
  ) =>
    apiRequest(
      `/Dashboard/location/${shopLocationId}?${buildQuery({ startDate, endDate })}`,
    ),

  getStats: (params: {
    shopId?: string;
    artistId?: string;
    shopLocationId?: string;
    startDate?: string;
    endDate?: string;
  }) => apiRequest(`/Dashboard/stats?${buildQuery(params)}`),

  getQuickStats: (params: {
    shopId?: string;
    artistId?: string;
    shopLocationId?: string;
  }) => apiRequest(`/Dashboard/quick?${buildQuery(params)}`),

  customerFilter: (filterParams: ServiceItemFilterDto) => {
    const queryString = buildQuery(filterParams);
    const url = queryString
      ? `/Dashboard/customer-filter?${queryString}`
      : "/Dashboard/customer-filter";
    return apiRequest(url);
  },
};

export const staffAPI = {
  getAll: () => apiRequest("/Staff"),

  getById: (staffId: string) => apiRequest(`/Staff/${staffId}`),

  getByShopId: (shopId: string) => apiRequest(`/Staff/shop/${shopId}`),

  getByLocationId: (locationId: string) =>
    apiRequest(`/Staff//location${locationId}`),

  getByAuth: () => apiRequest("/Staff/owner"),

  createStaff: (formData: FormData) =>
    apiRequest("/Staff", {
      method: "POST",
      body: formData,
    }),

  updateStaff: (staffId: string, formData: FormData) =>
    apiRequest(`/Staff/${staffId}`, {
      method: "PUT",
      body: formData,
    }),

  updateStatus: (staffId: string) =>
    apiRequest(`/Staff/status/${staffId}`, {
      method: "PUT",
    }),

  filter: (filterParams: StaffFilterDto) => {
    const queryString = buildQuery(filterParams);
    const url = queryString ? `/Staff/filter?${queryString}` : "/Staff/filter";
    return apiRequest(url);
  },
};

export const ratingAPI = {
  getByShopId: (shopId: string) => apiRequest(`/Rating/shop/${shopId}`),
  getByShopAuth: () => apiRequest(`/Rating/shopAuth`),

  getByLocationId: (locationId: string) =>
    apiRequest(`/Rating/shopLocation/${locationId}`),

  getByLocationAuth: () => apiRequest(`/Rating/shopLocationAuth`),

  getByArtistId: (artistId: string) => apiRequest(`/Rating/artist/${artistId}`),

  getByArtistAuth: () => apiRequest(`/Rating/artistAuth`),

  createRating: (bookingId: string, formData: FormData) =>
    apiRequest(`/Rating/${bookingId}`, {
      method: "POST",
      body: formData,
    }),

  deleteRating: (bookingId: string) =>
    apiRequest(`/Rating/${bookingId}`, {
      method: "DELETE",
    }),

  filter: (filterParams: RatingFilterDto) => {
    const queryString = buildQuery(filterParams);
    const url = queryString ? `/Rating/admin?${queryString}` : "/Rating/admin";
    return apiRequest(url);
  },
};

export const chatAPI = {
  getMyConversation: () => apiRequest(`/Chat/conversations`),

  getConversation: (conversationId: string) =>
    apiRequest(`/Chat/conversations/${conversationId}`),

  getOrCreateIndividualConversation: (otherProfileId: string) =>
    apiRequest(`/Chat/conversations/individual/${otherProfileId}`, {
      method: "POST",
    }),

  getOrCreateShopCustomerConversation: (shopId: string) =>
    apiRequest(`/Chat/conversations/shop/${shopId}`, {
      method: "POST",
    }),

  createGroupConversation: (formData: FormData) =>
    apiRequest(`/Chat/conversations/group`, {
      method: "POST",
      body: formData,
    }),

  getMessages: (conversationId: string) =>
    apiRequest(`/Chat/conversations/${conversationId}/messages`),

  // sendMessage: send an object so the server receives a JSON body like { content: "..." }
  sendMessage: (conversationId: string, content: string) =>
    apiRequest(`/Chat/conversations/${conversationId}/messages`, {
      method: "POST",
      body: { content } as any,
    }),

  deleteMessage: (messageId: string) =>
    apiRequest(`/Chat/messages/${messageId}`, {
      method: "DELETE",
    }),

  markAsRead: (conversationId: string) =>
    apiRequest(`/Chat/conversations/${conversationId}/read`, {
      method: "POST",
    }),

  getUnreadCount: () => apiRequest(`/Chat/unread`),

  addParticipant: (conversationId: string, profileIdToAdd: string) =>
    apiRequest(`/Chat/conversations/${conversationId}/participants`, {
      method: "POST",
      body: profileIdToAdd,
    }),

  removeParticipant: (conversationId: string, profileIdToRemove: string) =>
    apiRequest(
      `/Chat/conversations/${conversationId}/participants/${profileIdToRemove}`,
      {
        method: "DELETE",
      },
    ),

  leaveConversation: (conversationId: string) =>
    apiRequest(`/Chat/conversations/${conversationId}/leave`, {
      method: "DELETE",
    }),

  resolveConversation: (conversationId: string) =>
    apiRequest(`/Chat/conversations/${conversationId}/resolve`, {
      method: "POST",
    }),

  reopenConversation: (conversationId: string) =>
    apiRequest(`/Chat/conversations/${conversationId}/reopen`, {
      method: "POST",
    }),

  getShopConversations: (shopId: string) =>
    apiRequest(`/Chat/shop/${shopId}/conversations`),

  getShopUnreadCount: (shopId: string) =>
    apiRequest(`/Chat/shop/${shopId}/unread`),
};

export const blogAPI = {
  getById: (id: string) => apiRequest(`/BlogPost/${id}`),
  getByShop: (id: string) => apiRequest(`/BlogPost/shop/${id}`),
  getByShopAuth: () => apiRequest(`/BlogPost/shopAuth`),
  getByArtistId: (artistId: string) =>
    apiRequest(`/BlogPost/artist/${artistId}`),
  getByArtistAuth: () => apiRequest(`/BlogPost/artistAuth`),

  createBlogPost: (formData: FormData) =>
    apiRequest(`/BlogPost/`, {
      method: "POST",
      body: formData,
    }),

  updateBlogPost: (id: string, formData: FormData) =>
    apiRequest(`/BlogPost/${id}`, {
      method: "PUT",
      body: formData,
    }),

  deleteBlogPost: (id: string) =>
    apiRequest(`/BlogPost/${id}`, {
      method: "DELETE",
    }),

  filter: (filterParams: BlogPostFilterDto) => {
    const queryString = buildQuery(filterParams);
    const url = queryString
      ? `/BlogPost/filter?${queryString}`
      : "/BlogPost/filter";
    return apiRequest(url);
  },
};

export const commentAPI = {
  getById: (id: string) => apiRequest(`/Comment/${id}`),
  getByPost: (id: string) => apiRequest(`/Comment/post/${id}`),
  createComment: (id: string, formData: FormData) =>
    apiRequest(`/Comment/post/${id}`, {
      method: "POST",
      body: formData,
    }),

  createReply: (id: string, formData: FormData) =>
    apiRequest(`/Comment/reply/${id}`, {
      method: "POST",
      body: formData,
    }),

  updateComment: (id: string, formData: FormData) =>
    apiRequest(`/Comment/${id}`, {
      method: "PUT",
      body: formData,
    }),

  deleteComment: (id: string) =>
    apiRequest(`/Comment/${id}`, {
      method: "DELETE",
    }),
};

export const reactionAPI = {
  getByPost: (id: string) => apiRequest(`/Reaction/post/${id}`),
  getByPostAuth: (id: string) => apiRequest(`/Reaction/post/auth/${id}`),
  getByComment: (id: string) => apiRequest(`/Reaction/comment/${id}`),
  getByCommentAuth: (id: string) => apiRequest(`/Reaction/comment/auth/${id}`),

  togglePostReaction: (id: string, formData: FormData) =>
    apiRequest(`/Reaction/post/${id}`, {
      method: "POST",
      body: formData,
    }),

  toggleCommentReaction: (id: string, formData: FormData) =>
    apiRequest(`/Reaction/comment/${id}`, {
      method: "POST",
      body: formData,
    }),
};

export const subscriptionAPI = {
  getAll: () => apiRequest(`/Subscription`),

  getById: (id: string) =>
    apiRequest(`/Subscription/${id}`, {
      method: "GET",
    }),

  updateSub: (id: string, formData: FormData) =>
    apiRequest(`/Subscription/${id}`, {
      method: "PUT",
      body: formData,
    }),

  subscribe: (id: string) =>
    apiRequest(`/Subscription/${id}`, {
      method: "POST",
    }),
};

export const invoiceAPI = {
  getAll: () => apiRequest(`/Invoice`),

  getById: (id: string) =>
    apiRequest(`/Invoice/${id}`, {
      method: "GET",
    }),

  getByIdAuth: (id: string) =>
    apiRequest(`/Invoice/auth/${id}`, {
      method: "GET",
    }),
};

// In api.ts
export const buildQuery = (params?: Record<string, any>): string => {
  if (!params) return "";

  try {
    return Object.entries(params)
      .filter(
        ([_, value]) => value !== undefined && value !== null && value !== "",
      )
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value
            .map(
              (item) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(item)}`,
            )
            .join("&");
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join("&");
  } catch (error) {
    console.error("Error building query string:", error);
    return "";
  }
};
export default apiRequest;
