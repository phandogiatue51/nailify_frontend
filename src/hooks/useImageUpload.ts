import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

import { useAuth } from '@/contexts/AuthContext';

export const useImageUpload = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File, folder: string = 'general'): Promise<string | null> => {
    if (!user) return null;
    
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${folder}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('nail-images')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('nail-images')
        .getPublicUrl(fileName);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading };
};
