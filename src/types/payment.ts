import { PaymentMethod } from "@/types/payment"

export type PaymentPeriodFilter = 'all' | 'current' | 'overdue' | 'upcoming'
export type PaymentStatusFilter = 'all' | 'pending' | 'paid' | 'late'
export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'

export interface PaymentHistoryEntry {
  id: string
  amount: number
  date: string
  type: string
  status: string
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

export interface PaymentSummary {
  totalReceived: number
  pendingAmount: number
  latePayments: number
  nextPaymentDue?: {
    amount: number
    dueDate: string
  }
}

export interface PaymentTypeSelectorProps {
  value: string
  onChange: (value: string) => void
  hasLatePayments?: boolean
  latePaymentsCount?: number
  totalLateAmount?: number
}

export interface LatePaymentFormProps {
  lease: ApartmentLease
  onSuccess?: () => void
  isSubmitting: boolean
  setIsSubmitting: (value: boolean) => void
}

export interface PaymentActionButtonProps {
  leaseId: string
  onSuccess?: () => void
}

export interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leaseId: string
  lease: ApartmentLease
}

export interface LeaseSelectProps {
  value: string
  onChange: (value: string) => void
  leases: ApartmentLease[]
  isLoading: boolean
}

export interface PeriodOption {
  value: number
  label: string
  startDate: Date
  endDate: Date
  amount: number
}