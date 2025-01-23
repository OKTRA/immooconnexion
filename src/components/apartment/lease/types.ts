export interface LeaseFormData {
  unit_id: string;
  start_date: string;
  end_date?: string;
  rent_amount: number;
  deposit_amount: number;
  payment_frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  duration_type: 'fixed' | 'month_to_month' | 'yearly';
  payment_type: 'upfront' | 'end_of_period';
}

export interface CreateLeaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantId: string;
  unitId?: string;
}