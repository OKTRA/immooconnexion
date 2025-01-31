import { PaymentMethod } from "@/types/payment"

export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
export type DurationType = 'fixed' | 'month_to_month' | 'yearly'
export type PaymentStatusType = 'paid_current' | 'paid_advance' | 'paid_late' | 'pending'

export interface LeasePaymentViewProps {
  leaseId: string
}

export interface InitialPaymentFormProps {
  leaseId: string
  depositAmount: number
  rentAmount: number
  paymentFrequency?: PaymentFrequency
  firstRentStartDate?: Date
  onSuccess?: () => void
}

export interface PaymentPeriod {
  id: string
  startDate: Date
  endDate: Date
  amount: number
  status: string
  label?: string
  isPaid?: boolean
}

export interface PaymentSummary {
  totalReceived: number
  pendingAmount: number
  lateAmount: number
  nextPayment?: {
    amount: number
    due_date: string
  }
}

export interface LeaseData {
  id: string
  tenant_id: string
  unit_id: string
  start_date: string
  end_date?: string
  rent_amount: number
  deposit_amount: number
  payment_frequency: PaymentFrequency
  duration_type: DurationType
  status: string
  payment_type: PaymentStatusType
  tenant: {
    id: string
    first_name: string
    last_name: string
    phone_number?: string
  }
  unit?: {
    id: string
    unit_number: string
    apartment?: {
      id: string
      name: string
    }
  }
  initial_fees_paid?: boolean
  initial_payments_completed?: boolean
  agency_id: string
}

export interface PaymentFormData {
  leaseId: string
  amount: number
  paymentMethod: PaymentMethod
  paymentPeriods: string[]
  paymentDate: Date
  notes?: string
  isHistorical?: boolean
}

export interface PaymentTypeSelectorProps {
  value: PaymentStatusType
  onChange: (value: PaymentStatusType) => void
  hasLatePayments?: boolean
  latePaymentsCount?: number
  totalLateAmount?: number
}

export interface LatePaymentFormProps {
  lease: LeaseData
  onSuccess?: () => void
  isSubmitting: boolean
  setIsSubmitting: (value: boolean) => void
}

export interface PaymentListProps {
  title: string
  payments: PaymentListItem[]
  className?: string
}

export interface PaymentListItem {
  id: string
  amount: number
  status: string
  payment_date?: string
  due_date: string
  payment_period_start?: string
  payment_period_end?: string
  type?: 'deposit' | 'agency_fees' | 'rent'
  payment_method?: PaymentMethod
  payment_type?: string
  displayStatus?: string
}

export interface RegularPaymentsListProps extends PaymentListProps {
  onPaymentClick?: (payment: PaymentListItem) => void
}

export type PaymentPeriodFilter = 'all' | 'current' | 'overdue' | 'upcoming'
export type PaymentStatusFilter = 'all' | 'pending' | 'paid' | 'late'

export interface PeriodOption {
  value: number
  label: string
  startDate: Date
  endDate: Date
  amount: number
}