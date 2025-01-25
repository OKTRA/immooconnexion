import { PaymentMethod } from "./payment"

export interface PaymentFormData {
  leaseId: string
  amount: number
  paymentMethod: PaymentMethod
  selectedPeriods: string[]
  paymentDate: Date
  notes?: string
  isHistorical?: boolean
}

export interface PaymentFormProps {
  onSuccess?: () => void
  leaseId: string
  isHistorical?: boolean
}

export interface PeriodOption {
  id: string
  startDate: Date
  endDate: Date
  amount: number
  status: 'pending' | 'paid' | 'late'
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
  selectedPeriods: PeriodOption[]
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

export type PaymentFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'