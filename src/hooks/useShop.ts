// src/hooks/useShop.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shopAPI } from '@/services/api';
import { Shop } from '@/types/database';
import { useAuthContext } from './../components/auth/AuthProvider';

export const useShop = () => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  // Get all shops for the authenticated user
  const { data: myShops = [], isLoading: shopsLoading, refetch: refetchMyShops } = useQuery({
    queryKey: ['my-shops', user?.userId],
    queryFn: async () => {
      if (!user) return [];
      try {
        return await shopAPI.getMyShops();
      } catch (error: any) {
        console.error('Error fetching user shops:', error);
        // Return empty array for 404 (user has no shops yet)
        if (error.message?.includes('404') || error.message?.includes('not found')) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!user && user?.role === 'ShopOwner', // Only fetch if user is ShopOwner
  });

  // For backward compatibility - get first shop from the list
  const myShop = myShops?.[0] || null;
  const shopLoading = shopsLoading;

  const createShop = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!user || user.role !== 'ShopOwner') {
        throw new Error('Only Shop Owners can create shops');
      }
      return await shopAPI.createShop(formData);
    },
    onSuccess: (data) => {
      // Invalidate the user's shops query
      queryClient.invalidateQueries({ queryKey: ['my-shops'] });
      return data;
    },
    onError: (error: any) => {
      console.error('Error creating shop:', error);
      throw error;
    },
  });

  const updateShop = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      return await shopAPI.updateShop(id, formData);
    },
    onSuccess: (updatedShop) => {
      // Update cache for specific shop
      queryClient.setQueryData(['shop', updatedShop.id], updatedShop);

      // Update user's shops list
      queryClient.setQueryData(['my-shops', user?.userId], (old: Shop[] = []) =>
        old.map(shop => shop.id === updatedShop.id ? updatedShop : shop)
      );

      return updatedShop;
    },
    onError: (error: any) => {
      console.error('Error updating shop:', error);
      throw error;
    },
  });

  const deleteShop = useMutation({
    mutationFn: async (shopId: string) => {
      // You'll need to add this to your shopAPI
      // return await shopAPI.deleteShop(shopId);
      throw new Error('Delete shop endpoint not implemented');
    },
    onSuccess: (_, shopId) => {
      // Remove from user's shops list
      queryClient.setQueryData(['my-shops', user?.userId], (old: Shop[] = []) =>
        old.filter(shop => shop.id !== shopId)
      );

      // Remove shop from cache
      queryClient.removeQueries({ queryKey: ['shop', shopId] });
    },
  });

  return {
    myShop,         // First shop (for backward compatibility)
    myShops,        // All user's shops (array)
    shopLoading,    // Loading state for single shop
    shopsLoading,   // Loading state for all shops
    createShop,
    updateShop,
    deleteShop,
    refetchMyShops,
    canManageShop: user?.role === 'ShopOwner',
  };
};

export const useAllShops = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['shops'],
    queryFn: async () => {
      try {
        return await shopAPI.getAll();
      } catch (error: any) {
        console.error('Error fetching all shops:', error);
        return [];
      }
    },
    enabled: options?.enabled ?? true,
  });
};

export const useShopById = (shopId: string | undefined) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['shop', shopId],
    queryFn: async () => {
      if (!shopId) return null;
      try {
        return await shopAPI.getById(shopId);
      } catch (error: any) {
        console.error('Error fetching shop by ID:', error);
        if (error.message?.includes('404')) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!shopId,
    initialData: () => {
      // Try to get initial data from cache (user's shops list)
      if (!shopId) return undefined;

      const userShops = queryClient.getQueryData<Shop[]>(['my-shops']);
      if (userShops) {
        return userShops.find(shop => shop.id === shopId);
      }

      const allShops = queryClient.getQueryData<Shop[]>(['shops']);
      if (allShops) {
        return allShops.find(shop => shop.id === shopId);
      }

      return undefined;
    },
  });
};

// Helper function to create FormData for shop operations
export const createShopFormData = (
  shopData: Partial<Shop> & {
    logo?: File;
    cover?: File;
  }
): FormData => {
  const formData = new FormData();

  // Add all string/number fields
  Object.entries(shopData).forEach(([key, value]) => {
    if (key === 'logo' || key === 'cover') return; // Skip file fields

    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  // Add files with proper field names (matching your backend)
  if (shopData.logo && shopData.logo instanceof File) {
    formData.append('logoFile', shopData.logo);
  }

  if (shopData.cover && shopData.cover instanceof File) {
    formData.append('coverFile', shopData.cover);
  }

  return formData;
};

// Pre-configured shop form data creator
export const shopFormDataCreators = {
  create: (data: {
    name: string;
    description?: string;
    location?: string;
    contact_email?: string;
    contact_phone?: string;
    logo?: File;
    cover?: File;
  }) => createShopFormData(data),

  update: (data: Partial<Shop> & {
    logo?: File;
    cover?: File;
  }) => createShopFormData(data),
};