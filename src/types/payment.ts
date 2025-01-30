export type PaymentMethod = 'cash' | 'bank_transfer' | 'check' | 'mobile_money' | 'card'
export type PaymentType = 'rent' | 'deposit' | 'agency_fees' | 'late_fee'
export type PaymentStatus = 'pending' | 'paid' | 'late' | 'cancelled'
export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'

export interface PaymentFormData {
  amount: number
  paymentMethod: PaymentMethod
  paymentDate: Date
  notes?: string
  isHistorical?: boolean
  periodStart?: Date
  periodEnd?: Date
}

export interface PaymentPeriod {
  id: string
  startDate: Date
  endDate: Date
  amount: number
  status: string
  penalties?: Array<{
    id: string
    amount: number
    daysLate: number
  }>
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

export interface PaymentHistoryEntry {
  id: string
  amount: number
  paymentDate: string
  paymentMethod: PaymentMethod
  status: PaymentStatus
  type: PaymentType
  periodStart?: string
  periodEnd?: string
  notes?: string
}

export type PaymentPeriodFilter = 'all' | 'current' | 'overdue' | 'upcoming'
export type PaymentStatusFilter = 'all' | 'pending' | 'paid' | 'late'

export interface PaymentListProps {
  title: string
  payments: PaymentHistoryEntry[]
  className?: string
}

export interface RegularPaymentsListProps extends PaymentListProps {
  onPaymentClick?: (payment: PaymentHistoryEntry) => void
}

export interface PeriodOption {
  value: number
  label: string
  startDate: Date
  endDate: Date
  amount: number
}

export interface PaymentFormProps {
  leaseId: string
  lease: ApartmentLease
  onSuccess?: () => void
  isHistorical?: boolean
}

export interface LeaseSelectProps {
  leases: ApartmentLease[]
  selectedLeaseId: string
  onLeaseSelect: (value: string) => void
  isLoading: boolean
}