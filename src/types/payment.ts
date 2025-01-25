// Types de base
export type PaymentMethod = 'cash' | 'bank_transfer' | 'mobile_money' | 'check';
export type PaymentStatusType = 'pending' | 'paid_current' | 'paid_advance' | 'late' | 'cancelled';
export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

// Interface pour les pénalités
export interface PaymentPenalty {
  id: string;
  amount: number;
  daysLate: number;
  calculatedAt: Date;
  status: 'pending' | 'paid' | 'cancelled';
}

// Interface pour les périodes de paiement
export interface PaymentPeriod {
  id: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  status: PaymentStatusType;
  penalties?: PaymentPenalty[];
  paidAmount?: number;
  remainingAmount?: number;
}

// Interface pour le résumé des paiements
export interface PaymentSummary {
  rentAmount: number;
  penaltiesAmount: number;
  totalAmount: number;
  periodsCount: number;
  paidPeriodsCount?: number;
  latePeriodsCount?: number;
  advancePeriodsCount?: number;
}

// Interface pour l'historique des paiements
export interface PaymentHistoryEntry {
  id: string;
  date: Date;
  amount: number;
  type: 'rent' | 'penalty' | 'deposit' | 'agency_fees';
  status: PaymentStatusType;
  periodStart?: Date;
  periodEnd?: Date;
  paymentMethod: PaymentMethod;
  notes?: string;
}

// Interface pour le formulaire de paiement
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
  includePenalties?: boolean;
  isPartialPayment?: boolean;
}

// Interface pour les modifications de statut
export interface PaymentStatusChange {
  id: string;
  paymentId: string;
  oldStatus: PaymentStatusType;
  newStatus: PaymentStatusType;
  changedAt: Date;
  changedBy: string;
  reason?: string;
}

// Interface pour la gestion des paiements partiels
export interface PartialPayment {
  id: string;
  paymentPeriodId: string;
  amount: number;
  date: Date;
  remainingAmount: number;
  status: PaymentStatusType;
}

// Props pour les composants
export interface PaymentPeriodSelectorProps {
  periods: PaymentPeriod[];
  selectedPeriods: string[];
  onPeriodsChange: (periods: string[]) => void;
  disabledPeriods?: string[];
  showPenalties?: boolean;
}

export interface PaymentSummaryProps {
  summary: PaymentSummary;
  showDetails?: boolean;
  onPaymentOptionChange?: (includePenalties: boolean) => void;
}

export interface PaymentListProps {
  title: string;
  payments: PaymentHistoryEntry[];
  className?: string;
}

export interface LeaseData {
  id: string;
  tenant_id: string;
  unit_id: string;
  start_date: string;
  end_date?: string;
  rent_amount: number;
  deposit_amount: number;
  payment_frequency: PaymentFrequency;
  duration_type: string;
  payment_type: string;
  status: string;
  tenant: {
    id: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
  };
  unit?: {
    id: string;
    unit_number: string;
    apartment?: {
      id: string;
      name: string;
    };
  };
}

export interface LeaseSelectProps {
  leases: LeaseData[];
  selectedLeaseId: string;
  onLeaseSelect: (value: string) => void;
  isLoading: boolean;
}

export interface RegularPaymentsListProps extends PaymentListProps {
  onPaymentClick?: (payment: PaymentHistoryEntry) => void;
}