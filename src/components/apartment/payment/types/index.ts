import { PaymentMethod } from "./payment"

export interface PaymentFormData {
  leaseId: string
  amount: number
  paymentMethod: PaymentMethod
  paymentPeriods: string[]
  paymentDate: Date
  notes?: string
  isHistorical?: boolean
  periodStart?: Date
  periodEnd?: Date
}

export interface PaymentFormProps {
  onSuccess?: () => void
  leaseId: string
  isHistorical?: boolean
}

export interface PeriodOption {
  value: number
  label: string
  startDate: Date
  endDate: Date
  amount: number
  status: 'pending' | 'paid' | 'late' | 'future'
}

export interface PaymentDetailsProps {
  lease: {
    id: string
    rent_amount: number
    tenant: {
      first_name: string
      last_name: string
    }
    unit: {
      unit_number: string
      apartment?: {
        name: string
      }
    }
  }
  selectedPeriods: string[]
  totalAmount: number
}

export interface PaymentListProps {
  title: string
  payments: Array<{
    id: string
    amount: number
    status: string
    payment_date?: string
    due_date: string
    payment_period_start?: string
    payment_period_end?: string
  }>
}

export interface LeaseData {
  id: string
  tenant_id: string
  unit_id: string
  start_date: string
  end_date?: string
  rent_amount: number
  deposit_amount: number
  payment_frequency: string
  duration_type: string
  payment_type: string
  status: string
  tenant: {
    id: string
    first_name: string
    last_name: string
    phone_number?: string
  }
  unit: {
    id: string
    unit_number: string
    apartment: {
      id: string
      name: string
    }
  }
}

export interface LeaseSelectProps {
  leases: LeaseData[]
  selectedLeaseId: string
  onLeaseSelect: (value: string) => void
  isLoading: boolean
}

export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'