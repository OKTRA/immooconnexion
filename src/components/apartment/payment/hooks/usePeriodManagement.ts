import { useState } from "react"
import { PeriodOption } from "../types"

export function usePeriodManagement() {
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([])
  const [periodOptions, setPeriodOptions] = useState<PeriodOption[]>([])

  const generatePeriodOptions = (startDate: string, frequency: string) => {
    const options: PeriodOption[] = []
    const start = new Date(startDate)
    
    for (let i = 0; i < 12; i++) {
      const periodStart = new Date(start)
      periodStart.setMonth(start.getMonth() + i)
      
      const periodEnd = new Date(periodStart)
      periodEnd.setMonth(periodStart.getMonth() + 1)
      periodEnd.setDate(periodEnd.getDate() - 1)

      options.push({
        value: i.toString(),
        label: `${periodStart.toLocaleDateString()} - ${periodEnd.toLocaleDateString()}`
      })
    }

    setPeriodOptions(options)
  }

  return {
    periodOptions,
    selectedPeriods,
    setSelectedPeriods,
    generatePeriodOptions
  }
}