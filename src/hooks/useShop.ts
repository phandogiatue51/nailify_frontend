import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

import { Shop } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';

export const useShop = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: myShop, isLoading: shopLoading } = useQuery({
    queryKey: ['my-shop', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Shop | null;
    },
    enabled: !!user,
  });

  const createShop = useMutation({
    mutationFn: async (shop: Omit<Shop, 'id' | 'owner_id' | 'created_at' | 'updated_at' | 'is_active'>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('shops')
        .insert({
          ...shop,
          owner_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as Shop;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-shop'] });
    },
  });

  const updateShop = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Shop> & { id: string }) => {
      const { data, error } = await supabase
        .from('shops')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Shop;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-shop'] });
    },
  });

  return {
    myShop,
    shopLoading,
    createShop,
    updateShop,
  };
};

export const useAllShops = () => {
  return useQuery({
    queryKey: ['shops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Shop[];
    },
  });
};

export const useShopById = (shopId: string | undefined) => {
  return useQuery({
    queryKey: ['shop', shopId],
    queryFn: async () => {
      if (!shopId) return null;
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('id', shopId)
        .single();
      
      if (error) throw error;
      return data as Shop;
    },
    enabled: !!shopId,
  });
};
