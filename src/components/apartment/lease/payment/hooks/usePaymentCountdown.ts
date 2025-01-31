import { useState, useEffect } from 'react'
import { addMonths, addQuarters, addYears } from 'date-fns'
import { PaymentFrequency } from '../../types'

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
}

const calculateNextPayment = (firstRentDate: Date, frequency: PaymentFrequency): Date => {
  let nextDate = new Date(firstRentDate)
  const today = new Date()
  
  while (nextDate < today) {
    switch (frequency) {
      case 'monthly':
        nextDate = addMonths(nextDate, 1)
        break
      case 'quarterly':
        nextDate = addQuarters(nextDate, 1)
        break
      case 'yearly':
        nextDate = addYears(nextDate, 1)
        break
      default:
        nextDate = addMonths(nextDate, 1)
    }
  }
  
  return nextDate
}

const calculateTimeRemaining = (dueDate: Date): TimeRemaining => {
  const now = new Date()
  const due = new Date(dueDate)
  const diff = due.getTime() - now.getTime()
  
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  }
}

export const usePaymentCountdown = (
  firstRentDate: Date | null,
  frequency: PaymentFrequency
): TimeRemaining | null => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining | null>(null)
  
  useEffect(() => {
    if (!firstRentDate) return

    const updateCountdown = () => {
      const nextPayment = calculateNextPayment(firstRentDate, frequency)
      const remaining = calculateTimeRemaining(nextPayment)
      setTimeLeft(remaining)
    }
    
    const timer = setInterval(updateCountdown, 60000)
    updateCountdown()
    
    return () => clearInterval(timer)
  }, [firstRentDate, frequency])
  
  return timeLeft
}