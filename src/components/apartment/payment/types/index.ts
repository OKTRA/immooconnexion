export type PaymentMethod = "cash" | "bank_transfer" | "mobile_money"
export type PaymentType = "deposit" | "agency_fees" | "rent"

export interface PaymentFormData {
  leaseId: string
  amount: number
  paymentMethod: PaymentMethod
  paymentPeriods: string[]
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
  status: string
  payment_type: string
  tenant: {
    id: string
    first_name: string
    last_name: string
    phone_number?: string
  }
  unit: {
    id: string
    unit_number: string
    apartment?: {
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

export interface PaymentFormProps {
  onSuccess: () => void
  leaseId?: string
  tenantId: string
  paymentType?: PaymentType
}

export interface RegularPaymentsListProps {
  payments: Array<{
    id: string
    amount: number
    due_date: string
    payment_date?: string
    status: string
    type: string
    payment_method?: string
    payment_period_start?: string
    payment_period_end?: string
  }>
}