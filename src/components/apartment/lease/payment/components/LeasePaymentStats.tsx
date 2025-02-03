import { PaymentSummary } from "../types";
import { PaymentStatusStats } from "./PaymentStatusStats";

interface LeasePaymentStatsProps {
  stats: PaymentSummary;
}

export function LeasePaymentStats({ stats }: LeasePaymentStatsProps) {
  return <PaymentStatusStats stats={stats} />;
}