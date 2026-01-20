//https://localhost:7144/api
//https://nailify.onrender.com/api

import { BookingStatus } from "@/types/database";

const REACT_APP_API_URL = "https://eli-calculational-temika.ngrok-free.dev/api";

const API_BASE_URL = REACT_APP_API_URL || "https://nailify.onrender.com/api";

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

  updateProfile: (userData: any) =>
    apiRequest(`/Profile/`, {
      method: "PUT",
      body: userData,
    }),

  changePassword: (passwordData: any) =>
    apiRequest(`/Profile/change-password/`, {
      method: "PUT",
      body: passwordData,
    }),

  getProfile: () => apiRequest("/Profile/user-profile"),
};

export const collectionAPI = {
  getAll: () => apiRequest("/Collection"),

  getById: (id: string) => apiRequest(`/Collection/${id}`),

  getByShop: (shopId: string) => apiRequest(`/Collection/shop/${shopId}`),

  createShop: (formData: FormData) =>
    apiRequest("/Collection", {
      method: "POST",
      body: formData,
    }),

  updateShop: (id: string, formData: FormData) =>
    apiRequest(`/Collection/${id}`, {
      method: "PUT",
      body: formData,
    }),
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

  updateShop: (id: string, formData: FormData) =>
    apiRequest(`/Shop/${id}`, {
      method: "PUT",
      body: formData,
    }),
};

export const serviceItemAPI = {
  getAll: () => apiRequest("/ServiceItem"),

  getById: (id: string) => apiRequest(`/ServiceItem/${id}`),

  getByShop: (shopId: string) => apiRequest(`/ServiceItem/shop/${shopId}`),

  createServiceItem: (formData: FormData) =>
    apiRequest("/ServiceItem", {
      method: "POST",
      body: formData,
    }),

  updateServiceItem: (id: string, formData: FormData) =>
    apiRequest(`/ServiceItem/${id}`, {
      method: "PUT",
      body: formData,
    }),
};

export const BookingAPI = {
  getAll: () => apiRequest("/Booking"),

  getById: (id: string) => apiRequest(`/Booking/${id}`),

  getByShop: (shopId: string) => apiRequest(`/Booking/shop/${shopId}`),

  getByCustomer: (customerId: string) =>
    apiRequest(`/Booking/customer/${customerId}`),

  createBooking: (dto: any) =>
    apiRequest("/Booking", {
      method: "POST",
      body: dto,
    }),

  updateStatus: (id: string, status: BookingStatus) =>
    apiRequest(`/Booking/update-status/${id}`, {
      method: "PUT",
      body: status,
    }),
};

export default apiRequest;
