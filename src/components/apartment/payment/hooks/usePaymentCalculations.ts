import { useState, useEffect } from "react"
import { PaymentPeriod, PaymentSummary } from "../types"

export function usePaymentCalculations(
  selectedPeriods: PaymentPeriod[],
  baseAmount: number
) {
  const [summary, setSummary] = useState<PaymentSummary>({
    totalAmount: 0,
    rentAmount: 0,
    penaltiesAmount: 0,
    periodsCount: 0
  })

  useEffect(() => {
    const rentAmount = selectedPeriods.reduce((sum, period) => sum + period.amount, 0)
    const penaltiesAmount = selectedPeriods.reduce((sum, period) => {
      const penalties = period.penalties || []
      return sum + penalties.reduce((pSum, p) => pSum + p.amount, 0)
    }, 0)

    setSummary({
      rentAmount,
      penaltiesAmount,
      totalAmount: rentAmount + penaltiesAmount,
      periodsCount: selectedPeriods.length
    })
  }, [selectedPeriods, baseAmount])

  return { summary }
}