import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serviceItemAPI } from "@/services/api";
import { ServiceItem, ComponentType } from "@/types/database";

export const useServiceItems = (shopId: string | undefined) => {
  const queryClient = useQueryClient();

  const { data: serviceItems = [], isLoading } = useQuery({
    queryKey: ["service-items", shopId],
    queryFn: async () => {
      if (!shopId) return [];
      try {
        return await serviceItemAPI.getByShop(shopId);
      } catch (error: any) {
        console.error('Error fetching service items:', error);
        if (error.message?.includes('404') || error.message?.includes('not found')) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!shopId,
  });

  const createServiceItem = useMutation({
    mutationFn: async (
      formData: FormData
    ) => {
      if (!shopId) throw new Error('Shop ID is required');

      // Add shopId to formData if not already present
      if (!formData.has('shopId')) {
        formData.append('shopId', shopId);
      }

      return await serviceItemAPI.createServiceItem(formData);
    },
    onSuccess: (data) => {
      // Update cache immediately
      queryClient.setQueryData(['service-items', shopId], (old: ServiceItem[] = []) =>
        [...old, data]
      );

      // Invalidate query to ensure freshness
      queryClient.invalidateQueries({ queryKey: ["service-items", shopId] });
      return data;
    },
    onError: (error: any) => {
      console.error('Error creating service item:', error);
      throw error;
    },
  });

  const updateServiceItem = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      return await serviceItemAPI.updateServiceItem(id, formData);
    },
    onSuccess: (updatedItem) => {
      // Update cache immediately
      queryClient.setQueryData(['service-items', shopId], (old: ServiceItem[] = []) =>
        old.map(item => item.id === updatedItem.id ? updatedItem : item)
      );

      // Invalidate query to ensure freshness
      queryClient.invalidateQueries({ queryKey: ["service-items", shopId] });
      return updatedItem;
    },
    onError: (error: any) => {
      console.error('Error updating service item:', error);
      throw error;
    },
  });

  const deleteServiceItem = useMutation({
    mutationFn: async (id: string) => {
      // Soft delete - update is_active to false via FormData
      const formData = new FormData();
      formData.append('isActive', 'false');

      return await serviceItemAPI.updateServiceItem(id, formData);
    },
    onSuccess: (_, itemId) => {
      // Remove from cache immediately
      queryClient.setQueryData(['service-items', shopId], (old: ServiceItem[] = []) =>
        old.filter(item => item.id !== itemId)
      );

      // Invalidate query
      queryClient.invalidateQueries({ queryKey: ["service-items", shopId] });
    },
    onError: (error: any) => {
      console.error('Error deleting service item:', error);
      throw error;
    },
  });

  // Group items by component type
  const groupedItems = serviceItems.reduce(
    (acc, item) => {
      if (!acc[item.component_type]) {
        acc[item.component_type] = [];
      }
      acc[item.component_type].push(item);
      return acc;
    },
    {} as Record<ComponentType, ServiceItem[]>
  );

  return {
    serviceItems,
    groupedItems,
    isLoading,
    createServiceItem,
    updateServiceItem,
    deleteServiceItem,
  };
};

// Helper function to create FormData for service item operations
export const createServiceItemFormData = (data: {
  name: string;
  description?: string;
  price: number;
  component_type: ComponentType;
  shopId: string;
  image?: File; // IFormFile for your backend
  is_active?: boolean;
}) => {
  const formData = new FormData();

  // Add required fields
  formData.append('name', data.name);
  formData.append('price', data.price.toString());
  formData.append('componentType', data.component_type);
  formData.append('shopId', data.shopId);

  // Add optional fields
  if (data.description) formData.append('description', data.description);
  if (data.is_active !== undefined) formData.append('isActive', data.is_active.toString());

  // Add image if provided
  if (data.image && data.image instanceof File) {
    formData.append('image', data.image);
  }

  return formData;
};

// Hook for a specific service item
export const useServiceItemById = (itemId: string | undefined) => {
  return useQuery({
    queryKey: ["service-item", itemId],
    queryFn: async () => {
      if (!itemId) return null;
      try {
        return await serviceItemAPI.getById(itemId);
      } catch (error: any) {
        console.error('Error fetching service item:', error);
        return null;
      }
    },
    enabled: !!itemId,
  });
};

// Hook for all service items (admin view)
export const useAllServiceItems = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["all-service-items"],
    queryFn: async () => {
      try {
        return await serviceItemAPI.getAll();
      } catch (error: any) {
        console.error('Error fetching all service items:', error);
        return [];
      }
    },
    enabled: options?.enabled ?? true,
  });
};

// Pre-configured form data creators
export const serviceItemFormDataCreators = {
  create: (data: {
    name: string;
    description?: string;
    price: number;
    component_type: ComponentType;
    shopId: string;
    image?: File;
  }) => createServiceItemFormData(data),

  update: (data: Partial<ServiceItem> & {
    image?: File;
    shopId?: string;
  }) => {
    const formData = new FormData();

    // Add only provided fields
    if (data.name) formData.append('name', data.name);
    if (data.description !== undefined) formData.append('description', data.description);
    if (data.price !== undefined) formData.append('price', data.price.toString());
    if (data.componentType) formData.append('componentType', data.componentType);
    if (data.shopId) formData.append('shopId', data.shopId);

    // Add image if provided
    if (data.image && data.image instanceof File) {
      formData.append('image', data.image);
    }

    return formData;
  },
};