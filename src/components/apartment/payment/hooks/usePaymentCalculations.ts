
import { useState, useEffect } from "react"
import { PaymentSummary } from "../types"

export function usePaymentCalculations(paymentData: any[]) {
  const [summary, setSummary] = useState<PaymentSummary>({
    totalReceived: 0,
    pendingAmount: 0,
    latePayments: 0,
    lateAmount: 0,
    totalAmount: 0, // Added missing properties
    rentAmount: 0,
    penaltiesAmount: 0,
    periodsCount: 0
  })

  useEffect(() => {
    if (!paymentData || paymentData.length === 0) return

    const totalAmount = paymentData.reduce((acc, payment) => acc + (payment.amount || 0), 0)
    const totalReceived = paymentData.filter(p => p.status === 'paid').reduce((acc, p) => acc + (p.amount || 0), 0)
    const pendingAmount = paymentData.filter(p => p.status === 'pending').reduce((acc, p) => acc + (p.amount || 0), 0)
    const latePayments = paymentData.filter(p => p.status === 'late').length
    const lateAmount = paymentData.filter(p => p.status === 'late').reduce((acc, p) => acc + (p.amount || 0), 0)
    
    // Calculate the rent portion
    const rentAmount = paymentData.filter(p => p.payment_type === 'rent').reduce((acc, p) => acc + (p.amount || 0), 0)
    
    // Calculate penalties if any
    const penaltiesAmount = paymentData.filter(p => p.payment_type === 'late_fee').reduce((acc, p) => acc + (p.amount || 0), 0)
    
    setSummary({
      totalReceived,
      pendingAmount,
      latePayments,
      lateAmount,
      totalAmount,
      rentAmount,
      penaltiesAmount,
      periodsCount: paymentData.length
    })
  }, [paymentData])

  return { summary }
}
