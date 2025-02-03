import { differenceInDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { LeaseData, PaymentPeriod } from "../types";
import { calculatePeriodEndDate, getNextPeriodStart } from "../utils/periodCalculations";
import { CurrentPeriodDisplay } from "./CurrentPeriodDisplay";
import { PeriodsList } from "./PeriodsList";

interface PaymentTimelineProps {
  lease: LeaseData;
  initialPayments: PaymentListItem[];
}

export function PaymentTimeline({ lease, initialPayments }: PaymentTimelineProps) {
  const [periods, setPeriods] = useState<PaymentPeriod[]>([]);
  const [currentPeriod, setCurrentPeriod] = useState<PaymentPeriod | null>(null);

  useEffect(() => {
    const depositPayment = initialPayments.find(p => p.payment_type === 'deposit');
    const firstRentStartDate = depositPayment?.first_rent_start_date || lease.start_date;
    
    const generatePastPeriods = () => {
      const newPeriods: PaymentPeriod[] = [];
      let currentDate = new Date(firstRentStartDate);
      const now = new Date();
      
      while (currentDate <= now) {
        const endDate = calculatePeriodEndDate(currentDate, lease.payment_frequency);
        
        if (currentDate < now) {
          newPeriods.push({
            id: `${currentDate.getTime()}`,
            startDate: currentDate,
            endDate,
            amount: lease.rent_amount,
            status: "pending",
            isPaid: false,
            label: `${currentDate.toISOString()} - ${endDate.toISOString()}`
          });
        }
        
        currentDate = getNextPeriodStart(currentDate, lease.payment_frequency);
      }
      
      return newPeriods;
    };

    const generateCurrentPeriod = () => {
      const startDate = new Date(firstRentStartDate);
      const endDate = calculatePeriodEndDate(startDate, lease.payment_frequency);

      return {
        id: `current-${startDate.getTime()}`,
        startDate,
        endDate,
        amount: lease.rent_amount,
        status: "pending",
        isPaid: false,
        label: `${startDate.toISOString()} - ${endDate.toISOString()}`
      };
    };

    const pastPeriods = generatePastPeriods();
    const current = generateCurrentPeriod();
    
    setPeriods(pastPeriods);
    setCurrentPeriod(current);
  }, [lease, initialPayments]);

  const calculateProgress = (period: PaymentPeriod) => {
    const now = new Date();
    const total = differenceInDays(period.endDate, period.startDate);
    const elapsed = differenceInDays(now, period.startDate);
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suivi Chronologique des Paiements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <PeriodsList periods={periods} />
          
          {currentPeriod && (
            <CurrentPeriodDisplay 
              period={currentPeriod}
              progress={calculateProgress(currentPeriod)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}