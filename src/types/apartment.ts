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

export interface ApartmentTenant {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone_number: string | null;
  birth_date: string | null;
  photo_id_url: string | null;
  agency_id: string;
  unit_id: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ApartmentLease {
  id: string;
  tenant_id: string;
  unit_id: string;
  start_date: string;
  end_date: string | null;
  rent_amount: number;
  deposit_amount: number;
  payment_frequency: string;
  duration_type: string;
  status: string;
  agency_id: string;
  payment_type: "upfront" | "end_of_period";
  initial_fees_paid: boolean;
}

export interface ApartmentPayment {
  id: string;
  lease_id: string;
  amount: number;
  due_date: string;
  payment_date: string | null;
  status: string;
  payment_method: string;
  agency_id: string;
}