export interface Property {
  id: string;
  bien: string;
  type: string;
  chambres?: number;
  ville?: string;
  loyer?: number;
  frais_agence?: number;
  taux_commission?: number;
  caution?: number;
  photo_url?: string;
  statut?: string;
  user_id?: string;
  agency_id?: string;
  created_at?: string;
  updated_at?: string;
  created_by_user_id?: string;
  property_category: 'house' | 'duplex' | 'triplex';
  owner_name?: string;
  owner_phone?: string;
  country?: string;
  quartier?: string;
  owner_id?: string;
  agency?: {
    name: string;
    address: string;
  };
}

export interface PropertyFormFieldsProps {
  formData: PropertyFormData;
  setFormData: (data: PropertyFormData) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreviewUrl?: string | string[];
  propertyType?: "apartment" | "house";
  owners?: Array<{
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
  property_category: 'house' | 'duplex' | 'triplex';
  owner_name?: string;
  owner_phone?: string;
  country?: string;
  quartier?: string;
  owner_id?: string;
}

export interface PropertyDialogProps {
  property?: Property | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}