export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type DurationType = 'fixed' | 'month_to_month';
export type PaymentType = 'upfront' | 'end_of_period';
export type SplitType = 'A' | 'B';

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

export interface SplitLeaseFormData extends LeaseFormData {
  split_type: SplitType;
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

export interface SplitLeaseFormFieldsProps extends Omit<LeaseFormFieldsProps, 'formData'> {
  formData: SplitLeaseFormData;
  setFormData: (data: SplitLeaseFormData) => void;
}

export interface CreateLeaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantId: string;
  unitId?: string;
}

export interface SplitLeaseDialogProps extends CreateLeaseDialogProps {}