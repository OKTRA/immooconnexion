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
}

export interface PropertyFormData {
  bien: string;
  type: string;
  chambres: string;
  ville: string;
  loyer: string;
  taux_commission: string;
  caution: string;
  frais_agence: string;
  property_category: 'house' | 'duplex' | 'triplex';
  owner_name: string;
  owner_phone: string;
  country: string;
  quartier: string;
}

export interface PropertyDialogProps {
  property?: Property | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}