import { useState, useMemo } from 'react'
import { PaymentPeriod, PaymentSummary } from '../types'

export function usePaymentCalculations(selectedPeriods: PaymentPeriod[], includePenalties: boolean = true) {
  const [isCalculating, setIsCalculating] = useState(false)

  const summary = useMemo(() => {
    const rentAmount = selectedPeriods.reduce((sum, period) => sum + period.amount, 0)
    
    const penaltiesAmount = includePenalties ? selectedPeriods.reduce((sum, period) => {
      const periodPenalties = period.penalties?.reduce((pSum, penalty) => 
        penalty.status === 'pending' ? pSum + penalty.amount : pSum, 0) || 0
      return sum + periodPenalties
    }, 0) : 0

    return {
      totalAmount: rentAmount + (includePenalties ? penaltiesAmount : 0),
      rentAmount,
      penaltiesAmount,
      selectedPeriods
    } as PaymentSummary
  }, [selectedPeriods, includePenalties])

  return {
    summary,
    isCalculating
  }
}