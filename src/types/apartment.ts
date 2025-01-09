export type ApartmentUnitStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';

export interface ApartmentUnit {
  id: string;
  apartment_id: string;
  unit_number: string;
  floor_number?: number | null;
  area?: number | null;
  rent_amount: number;
  deposit_amount?: number | null;
  status: ApartmentUnitStatus;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ApartmentUnitFormData {
  id?: string;
  apartment_id?: string;
  unit_number: string;
  floor_number?: number | null;
  area?: number | null;
  rent_amount: number;
  deposit_amount?: number | null;
  status: ApartmentUnitStatus;
  description?: string | null;
}

export interface LeaseFormData {
  tenant_id: string;
  unit_id: string;
  start_date: string;
  end_date?: string;
  rent_amount: number;
  deposit_amount: number;
  payment_frequency: string;
  duration_type: string;
  payment_type: 'upfront' | 'monthly';
  initial_fees_paid: boolean;
  deposit_returned?: boolean;
  deposit_return_date?: string;
  deposit_return_amount?: number;
  deposit_return_notes?: string;
}

export interface TenantReceiptProps {
  tenant: TenantReceiptData;
  isEndReceipt?: boolean;
  isInitialReceipt?: boolean;
  lease?: {
    rent_amount: number;
    deposit_amount: number;
  };
}