import { supabase } from "@/integrations/supabase/client";

export const useTenantPhoto = () => {
  const uploadTenantPhoto = async (photoFile: File) => {
    if (!photoFile) return null;
    
    const fileExt = photoFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    
    const { error: uploadError, data } = await supabase.storage
      .from('tenant_photos')
      .upload(fileName, photoFile);

    if (uploadError) throw uploadError;
    return data.path;
  };

  return { uploadTenantPhoto };
};