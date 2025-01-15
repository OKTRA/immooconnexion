import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PaymentPeriodFilter, PaymentStatusFilter, PaymentsListProps } from "./types";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function PaymentsList({ periodFilter, statusFilter, tenantId }: PaymentsListProps) {
  const { data: payments, isLoading } = useQuery({
    queryKey: ["payments", periodFilter, statusFilter, tenantId],
    queryFn: async () => {
      console.log("Fetching payments for tenant:", tenantId);
      
      let query = supabase
        .from("apartment_lease_payments")
        .select(`
          *,
          apartment_leases (
            tenant_id,
            unit_id,
            apartment_tenants (
              first_name,
              last_name
            ),
            apartment_units (
              unit_number,
              apartments (
                name
              )
            )
          ),
          late_payment_fees (
            amount,
            days_late
          )
        `)
        .eq("apartment_leases.tenant_id", tenantId);

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      if (periodFilter === "current") {
        query = query.gte("payment_period_start", new Date().toISOString().split("T")[0])
          .lte("payment_period_end", new Date().toISOString().split("T")[0]);
      } else if (periodFilter === "overdue") {
        query = query.lt("payment_period_end", new Date().toISOString().split("T")[0])
          .neq("status", "paid");
      } else if (periodFilter === "upcoming") {
        query = query.gt("payment_period_start", new Date().toISOString().split("T")[0]);
      }

      const { data, error } = await query.order("due_date", { ascending: false });
      
      if (error) {
        console.error("Error fetching payments:", error);
        throw error;
      }
      
      console.log("Fetched payments:", data);
      return data;
    }
  });

  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case "deposit":
        return "Caution";
      case "agency_fees":
        return "Frais d'agence";
      case "rent":
        return "Loyer";
      default:
        return type;
    }
  };

  const getStatusBadgeVariant = (status: string, isLate: boolean) => {
    if (isLate) return "destructive";
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const hasInitialPayments = payments?.some(p => p.type === "deposit" || p.type === "agency_fees");
  const hasLatePayments = payments?.some(p => p.late_payment_fees && p.late_payment_fees.length > 0);

  return (
    <div className="space-y-4">
      {hasLatePayments && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Certains paiements sont en retard et des pénalités ont été appliquées.
          </AlertDescription>
        </Alert>
      )}

      {!hasInitialPayments && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Les paiements initiaux (caution et frais d'agence) sont en attente.
          </AlertDescription>
        </Alert>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Date d'échéance</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Pénalités</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments?.map((payment) => {
            const isLate = payment.late_payment_fees && payment.late_payment_fees.length > 0;
            const lateFee = isLate ? payment.late_payment_fees[0] : null;

            return (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">
                  {getPaymentTypeLabel(payment.type || "rent")}
                </TableCell>
                <TableCell>
                  {format(new Date(payment.due_date), "d MMM yyyy", { locale: fr })}
                </TableCell>
                <TableCell>
                  {Number(payment.amount).toLocaleString()} FCFA
                </TableCell>
                <TableCell>
                  {lateFee ? (
                    <div className="text-sm text-red-600">
                      +{Number(lateFee.amount).toLocaleString()} FCFA
                      <br />
                      <span className="text-xs">
                        ({lateFee.days_late} jours de retard)
                      </span>
                    </div>
                  ) : "-"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getStatusBadgeVariant(payment.status, isLate)}
                  >
                    {payment.status === "paid"
                      ? "Payé"
                      : isLate
                      ? "En retard"
                      : "En attente"}
                  </Badge>
                </TableCell>
              </TableRow>
            )
          })}
          {(!payments || payments.length === 0) && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Aucun paiement trouvé
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}