import { PaymentMethod } from "@/types/payment"
import { ApartmentLease } from "@/types/apartment"

export interface PaymentSummary {
  totalReceived: number
  pendingAmount: number
  lateAmount: number
  nextPayment?: {
    amount: number
    due_date: string
  }
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

export interface PaymentListProps {
  title: string
  payments: PaymentListItem[]
  className?: string
}

export interface LeasePaymentViewProps {
  leaseId: string
}

export interface LeaseData extends ApartmentLease {
  initialPayments?: PaymentListItem[]
  regularPayments?: PaymentListItem[]
}

export type PaymentPeriodFilter = 'all' | 'current' | 'overdue' | 'upcoming'
export type PaymentStatusFilter = 'all' | 'pending' | 'paid' | 'late'

export interface PaymentFormData {
  leaseId: string
  amount: number
  paymentMethod: PaymentMethod
  paymentPeriods: string[]
  paymentDate: Date
  notes?: string
  isHistorical?: boolean
}

export interface PaymentFormProps {
  onSuccess?: () => void
  leaseId: string
  lease?: ApartmentLease
  isHistorical?: boolean
}