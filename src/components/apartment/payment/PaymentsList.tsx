import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PaymentPeriodFilter, PaymentStatusFilter, PaymentsListProps } from "./types";
import { Loader2 } from "lucide-react";

export function PaymentsList({ periodFilter, statusFilter, tenantId }: PaymentsListProps) {
  const { data: payments, isLoading } = useQuery({
    queryKey: ["payments", periodFilter, statusFilter, tenantId],
    queryFn: async () => {
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
          )
        `)
        .eq("apartment_leases.tenant_id", tenantId);

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      if (periodFilter === "current") {
        query = query.gte("start_date", new Date().toISOString().split("T")[0])
          .lte("end_date", new Date().toISOString().split("T")[0]);
      } else if (periodFilter === "overdue") {
        query = query.lt("end_date", new Date().toISOString().split("T")[0])
          .neq("status", "paid");
      } else if (periodFilter === "upcoming") {
        query = query.gt("start_date", new Date().toISOString().split("T")[0]);
      }

      const { data, error } = await query.order("due_date", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!payments?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun paiement trouvé
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Locataire</TableHead>
          <TableHead>Appartement</TableHead>
          <TableHead>Unité</TableHead>
          <TableHead>Date d'échéance</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>
              {payment.apartment_leases?.apartment_tenants?.first_name}{" "}
              {payment.apartment_leases?.apartment_tenants?.last_name}
            </TableCell>
            <TableCell>
              {payment.apartment_leases?.apartment_units?.apartments?.name}
            </TableCell>
            <TableCell>
              {payment.apartment_leases?.apartment_units?.unit_number}
            </TableCell>
            <TableCell>
              {format(new Date(payment.due_date), "d MMM yyyy", { locale: fr })}
            </TableCell>
            <TableCell>
              {Number(payment.amount).toLocaleString()} FCFA
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  payment.status === "paid"
                    ? "success"
                    : payment.status === "late"
                    ? "destructive"
                    : "secondary"
                }
              >
                {payment.status === "paid"
                  ? "Payé"
                  : payment.status === "late"
                  ? "En retard"
                  : "En attente"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}