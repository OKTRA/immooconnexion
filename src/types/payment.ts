export interface LeasePayment {
  id: string
  lease_id: string
  amount: number
  payment_date: string | null
  due_date: string | null
  status: 'pending' | 'paid' | 'late'
  payment_method: string | null
  agency_id: string
  payment_type: string
  payment_period_start: string
  payment_period_end: string | null
  payment_status_type: string
  payment_notes: string | null
  created_at: string
  updated_at: string
}