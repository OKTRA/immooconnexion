export type PaymentMethod = 'cash' | 'bank_transfer' | 'mobile_money' | 'check';
export type PaymentStatusType = 'pending' | 'paid' | 'late' | 'cancelled';

export interface PaymentFormData {
  leaseId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentPeriods: string[];
  paymentDate: Date;
  periodStart?: Date;
  periodEnd?: Date;
  notes?: string;
  isHistorical?: boolean;
  status?: PaymentStatusType;
}

export interface PaymentSummary {
  totalReceived: number;
  pendingAmount: number;
  lateAmount: number;
  periodsCount: number;
}

export interface PaymentStats {
  totalReceived: number;
  pendingAmount: number;
  lateAmount: number;
  nextPayment?: {
    amount: number;
    dueDate: string;
  };
}

export interface PaymentPeriod {
  id: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  status: PaymentStatusType;
  penalties?: Array<{
    id: string;
    amount: number;
    daysLate: number;
  }>;
}

export interface LeaseData {
  id: string;
  tenant: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  };
  unit: {
    id: string;
    unitNumber: string;
    apartment: {
      id: string;
      name: string;
    };
  };
  rentAmount: number;
  depositAmount: number;
  startDate: string;
  endDate?: string;
  paymentFrequency: string;
  status: string;
}

export interface PeriodOption {
  value: number;
  label: string;
  amount: number;
}

export interface PaymentListProps {
  payments: Array<{
    id: string;
    amount: number;
    status: PaymentStatusType;
    paymentDate?: string;
    dueDate: string;
    periodStart?: string;
    periodEnd?: string;
  }>;
}

export interface LeaseSelectProps {
  leases: LeaseData[];
  selectedLeaseId: string;
  onLeaseSelect: (leaseId: string) => void;
  isLoading: boolean;
}