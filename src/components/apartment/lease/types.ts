export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type DurationType = 'fixed' | 'month_to_month' | 'yearly';
export type PaymentType = 'upfront' | 'monthly';
export type LeaseStatus = 'active' | 'expired' | 'terminated';

export interface CreateLeaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantId: string;
  unitId?: string;
}

export interface LeaseFormData {
  unit_id: string;
  start_date: string;
  end_date?: string;
  rent_amount: number;
  deposit_amount: number;
  payment_frequency: PaymentFrequency;
  duration_type: DurationType;
  payment_type: PaymentType;
}

export interface LeaseFormFieldsProps {
  formData: LeaseFormData;
  setFormData: (data: LeaseFormData) => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  disabled?: boolean;
  tenantId: string;
}