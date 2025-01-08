export type ApartmentUnitStatus = "available" | "occupied" | "maintenance";

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