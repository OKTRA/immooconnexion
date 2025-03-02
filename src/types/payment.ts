
export type PaymentMethod = 'cash' | 'bank_transfer' | 'mobile_money' | 'card';
export type PaymentStatus = 'pending' | 'paid' | 'late' | 'cancelled';
export type PaymentStatusType = 'paid_current' | 'paid_advance' | 'paid_late' | 'pending';
export type PaymentType = 'rent' | 'deposit' | 'agency_fees';
export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type PaymentPeriodFilter = 'all' | 'current' | 'overdue' | 'upcoming';
export type PaymentStatusFilter = 'all' | 'pending' | 'paid' | 'late';

export interface PaymentHistoryEntry {
  id: string;
  amount: number;
  payment_date: string;
  payment_type: PaymentType;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  periodStart?: string;
  periodEnd?: string;
  date?: string;
  notes?: string;
  paymentMethod?: string;
}

export interface PaymentSummary {
  totalReceived: number;
  pendingAmount: number;
  latePayments: number;
  lateAmount: number;
  nextPaymentDue?: {
    amount: number;
    dueDate: string;
  };
  // Additional properties needed by components
  totalAmount?: number;
  rentAmount?: number;
  penaltiesAmount?: number;
  periodsCount?: number;
}

export interface PaymentPeriod {
  id: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  status: PaymentStatus;
  isPaid: boolean;
  label: string;
  paymentId?: string;
  penalties?: Array<{
    id: string;
    amount: number;
    daysLate: number;
  }>;
}

export interface PaymentFormData {
  leaseId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentPeriods: string[];
  paymentDate: Date;
  notes?: string;
  isHistorical?: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  maxProperties: number;
  maxTenants: number;
  maxUsers: number;
  features: string[];
}

export interface SubscriptionLimits {
  maxProperties: number;
  maxTenants: number;
  maxUsers: number;
  currentProperties: number;
  currentTenants: number;
  currentUsers: number;
}
