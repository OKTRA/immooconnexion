
import { DurationType, LeaseStatus, PaymentType } from "@/types/lease";
import { PaymentFrequency } from "@/types/payment";

export interface FormData {
  tenant_id: string;
  unit_id: string;
  start_date: string;
  end_date?: string;
  rent_amount: number;
  deposit_amount: number;
  payment_frequency: PaymentFrequency;
  duration_type: DurationType;
  payment_type: PaymentType;
  status: LeaseStatus;
}

export interface LeaseFormFieldsProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  disabled?: boolean;
}

export interface LeaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unitId: string;
  tenantId?: string;
}

export interface CreateLeaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unitId: string;
}

export { DurationType, LeaseStatus, PaymentType };
