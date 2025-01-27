export interface PaymentFormData {
  leaseId?: string
  amount: number
  paymentMethod: string
  paymentDate: string
  paymentPeriods: string[]
  notes?: string
  agencyId?: string
}

export interface PaymentFormFieldsProps {
  formData: PaymentFormData
  setFormData: (data: PaymentFormData) => void
  onSubmit: () => Promise<void>
  isSubmitting: boolean
  onCancel: () => void
  lease: any
}