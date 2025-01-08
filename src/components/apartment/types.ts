export type ApartmentUnitStatus = "available" | "occupied" | "maintenance";

export interface ApartmentUnit {
  id: string;
  apartment_id: string;
  unit_number: string;
  floor_number: number | null;
  area: number | null;
  rent_amount: number;
  deposit_amount: number | null;
  status: ApartmentUnitStatus;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ApartmentUnitFormData {
  unit_number: string;
  floor_number: string;
  area: string;
  rent_amount: string;
  deposit_amount: string;
  status: ApartmentUnitStatus;
  description: string;
}

export interface ApartmentContract {
  id: string;
  montant: number;
  type: 'location';
  rent_amount: number;
  deposit_amount: number;
  start_date: string;
  end_date: string;
  status: string;
}

export interface ApartmentTenantReceipt {
  tenant: {
    first_name: string;
    last_name: string;
    phone_number: string;
    agency_fees?: number;
  };
  isEndReceipt?: boolean;
  lease?: ApartmentContract;
}

export interface ApartmentInspectionProps {
  lease: ApartmentContract;
  onClose: () => void;
  onSuccess?: () => void;
}