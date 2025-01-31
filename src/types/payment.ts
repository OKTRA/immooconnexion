export type PaymentMethod = "cash" | "bank_transfer" | "mobile_money" | "check"

export interface PaymentHistoryEntry {
  id: string
  amount: number
  date: string
  type: string
  status: string
}