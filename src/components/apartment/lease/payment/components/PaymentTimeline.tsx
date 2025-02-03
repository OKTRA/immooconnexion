import { differenceInDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { LeaseData, PaymentPeriod } from "../types";
import { calculatePeriodEndDate, getNextPeriodStart } from "../utils/periodCalculations";
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
        
        const periodPayment = lease.regularPayments?.find(p => {
          const paymentStart = new Date(p.payment_period_start);
          const paymentEnd = new Date(p.payment_period_end);
          return (
            paymentStart <= currentDate &&
            paymentEnd >= endDate
          );
        });

        const isPaid = periodPayment?.status === 'paid' || 
                      periodPayment?.payment_status_type?.includes('paid');
        
        if (currentDate < now) {
          newPeriods.push({
            id: `${currentDate.getTime()}`,
            startDate: currentDate,
            endDate,
            amount: lease.rent_amount,
            status: isPaid ? "paid" : "pending",
            isPaid,
            label: `${currentDate.toISOString()} - ${endDate.toISOString()}`
          });
        }
        
        currentDate = getNextPeriodStart(currentDate, lease.payment_frequency);
      }
      
      return newPeriods.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
    };

    const generateCurrentPeriod = () => {
      const startDate = new Date(firstRentStartDate);
      const endDate = calculatePeriodEndDate(startDate, lease.payment_frequency);

      const currentPayment = lease.regularPayments?.find(p => {
        const paymentStart = new Date(p.payment_period_start);
        const paymentEnd = new Date(p.payment_period_end);
        return (
          paymentStart <= startDate &&
          paymentEnd >= endDate
        );
      });

      const isPaid = currentPayment?.status === 'paid' || 
                    currentPayment?.payment_status_type?.includes('paid');

      return {
        id: `current-${startDate.getTime()}`,
        startDate,
        endDate,
        amount: lease.rent_amount,
        status: isPaid ? "paid" : "pending",
        isPaid,
        label: `${startDate.toISOString()} - ${endDate.toISOString()}`
      };
    };

    const pastPeriods = generatePastPeriods();
    const current = generateCurrentPeriod();
    
    setPeriods(pastPeriods);
    setCurrentPeriod(current);
  }, [lease, initialPayments]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suivi Chronologique des Paiements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentPeriod && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Période en cours</h3>
              <PeriodsList periods={[currentPeriod]} />
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Périodes précédentes</h3>
            <PeriodsList periods={periods} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}