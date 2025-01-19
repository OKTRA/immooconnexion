import { Property as DBProperty } from "@/integrations/supabase/types/properties"

export interface PropertyDialogProps {
  property?: DBProperty;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface PropertyFormFieldsProps {
  formData: PropertyFormData;
  setFormData: (data: PropertyFormData) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreviewUrl?: string | string[];
  propertyType?: 'house' | 'duplex' | 'triplex' | 'apartment';
  owners: Array<{
    id: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
  }>;
}

export interface PropertyFormData {
  bien: string;
  type: string;
  chambres?: number;
  ville?: string;
  loyer?: number;
  taux_commission?: number;
  caution?: number;
  property_category: 'house' | 'duplex' | 'triplex' | 'apartment';
  owner_name?: string;
  owner_phone?: string;
  country?: string;
  quartier?: string;
  owner_id?: string;
  description?: string;
  store_count?: number;
  kitchen_count?: number;
  has_pool?: boolean;
}

export type { DBProperty as Property };