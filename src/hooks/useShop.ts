// src/hooks/useShop.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { shopAPI } from "@/services/api";
import { Shop } from "@/types/database";
import { useAuthContext } from "./../components/auth/AuthProvider";
import { useToast } from "./use-toast";
import { useNavigate } from "react-router-dom";

export const useShop = () => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    data: myShop = null,
    isLoading: shopLoading,
    refetch: refetchMyShop,
  } = useQuery({
    queryKey: ["my-shop", user?.userId],
    queryFn: async () => {
      if (!user) return null;
      try {
        return await shopAPI.getMyShops();
      } catch (error: any) {
        console.error("Error fetching user shop:", error);
        if (
          error.message?.includes("404") ||
          error.message?.includes("not found")
        ) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!user && user?.role === 1,
  });

  const myShops = myShop ? [myShop] : [];

  const createShop = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!user || user.role !== 1) {
        throw new Error("Only Shop Owners can create shops");
      }
      if (myShop) {
        throw new Error(
          "You already have a shop. Each user can only own one shop.",
        );
      }
      return await shopAPI.createShop(formData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-shop"] });
      toast({
        description: data.message || "Tạo cửa hàng thành công!", // ✅ Use `data`
        variant: "success",
        duration: 3000,
      });

      setTimeout(() => {
        navigate("/shop-dashboard");
      }, 100);

      return data;
    },
    onError: (error: any) => {
      console.error("Error creating shop:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });
      throw error;
    },
  });

  const updateShop = useMutation({
    mutationFn: async ({ formData }: { formData: FormData }) => {
      return await shopAPI.updateShop(formData);
    },
    onSuccess: (updatedShop) => {
      queryClient.setQueryData(["shop", updatedShop.id], updatedShop);
      queryClient.setQueryData(["my-shop", user?.userId], updatedShop);
      toast({
        description: updatedShop.message || "Cập nhật cửa hàng thành công!", 
        variant: "success",
        duration: 3000,
      });

      return updatedShop;
    },
    onError: (error: any) => {
      console.error("Error updating shop:", error);
      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });
      throw error;
    },
  });

  return {
    myShop,
    myShops,
    shopLoading,
    shopsLoading: shopLoading,
    createShop,
    updateShop,
    refetchMyShop,
    canManageShop: user?.role === 1,
  };
};

export const useAllShops = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["shops"],
    queryFn: async () => {
      try {
        return await shopAPI.getAll();
      } catch (error: any) {
        console.error("Error fetching all shops:", error);
        return [];
      }
    },
    enabled: options?.enabled ?? true,
  });
};

export const useShopById = (shopId: string | undefined) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["shop", shopId],
    queryFn: async () => {
      if (!shopId) return null;
      try {
        return await shopAPI.getById(shopId);
      } catch (error: any) {
        console.error("Error fetching shop by ID:", error);
        if (error.message?.includes("404")) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!shopId,
    initialData: () => {
      if (!shopId) return undefined;

      // Try to get from user's shop query first
      const userShop = queryClient.getQueryData<Shop>(["my-shop"]);
      if (userShop && userShop.id === shopId) {
        return userShop;
      }

      // Try from all shops
      const allShops = queryClient.getQueryData<Shop[]>(["shops"]);
      if (allShops) {
        return allShops.find((shop) => shop.id === shopId);
      }

      return undefined;
    },
  });
};

// Helper functions remain the same
export const createShopFormData = (
  shopData: Partial<Shop> & {
    logo?: File;
    cover?: File;
  },
): FormData => {
  const formData = new FormData();

  Object.entries(shopData).forEach(([key, value]) => {
    if (key === "logo" || key === "cover") return;

    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  if (shopData.logo && shopData.logo instanceof File) {
    formData.append("logoFile", shopData.logo);
  }

  if (shopData.cover && shopData.cover instanceof File) {
    formData.append("coverFile", shopData.cover);
  }

  return formData;
};

export const shopFormDataCreators = {
  create: (data: {
    name: string;
    description?: string;
    logo?: File;
    cover?: File;
  }) => createShopFormData(data),

  update: (
    data: Partial<Shop> & {
      logo?: File;
      cover?: File;
    },
  ) => createShopFormData(data),
};
