import { ApartmentLease } from "@/types/apartment"

export interface LeaseData extends ApartmentLease {
  tenant: {
    id: string
    first_name: string
    last_name: string
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

export interface PaymentFormData {
  amount: number
  paymentMethod: string
  paymentDate: string
  paymentPeriods: string[]
  notes?: string
  isHistorical?: boolean
}

export interface PaymentFormProps {
  onSuccess?: () => void
  leaseId: string
  lease: LeaseData
  isHistorical?: boolean
}

export interface PaymentSummary {
  totalAmount: number
  rentAmount: number
  penaltiesAmount: number
  periodsCount: number
}