import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useTenantPayments } from "@/hooks/use-tenant-payments";
import { Loader2 } from "lucide-react";

interface TenantPaymentsTabProps {
  tenantId: string;
}

export function TenantPaymentsTab({ tenantId }: TenantPaymentsTabProps) {
  const { data, isLoading } = useTenantPayments(tenantId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune donnée disponible
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payments Section */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {payment.amount.toLocaleString()} FCFA
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Échéance: {format(new Date(payment.due_date), "PP", { locale: fr })}
                  </p>
                </div>
                <Badge
                  variant={payment.status === "paid" ? "success" : "secondary"}
                >
                  {payment.status === "paid" ? "Payé" : "En attente"}
                </Badge>
              </div>
            ))}
            {data.payments.length === 0 && (
              <p className="text-center text-muted-foreground">
                Aucun paiement enregistré
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Late Fees Section */}
      <Card>
        <CardHeader>
          <CardTitle>Pénalités de retard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.lateFees.map((fee) => (
              <div
                key={fee.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {fee.amount.toLocaleString()} FCFA
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Jours de retard: {fee.days_late}
                  </p>
                </div>
                <Badge
                  variant={fee.status === "paid" ? "success" : "destructive"}
                >
                  {fee.status === "paid" ? "Payé" : "Non payé"}
                </Badge>
              </div>
            ))}
            {data.lateFees.length === 0 && (
              <p className="text-center text-muted-foreground">
                Aucune pénalité de retard
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {notification.type === "late_payment"
                      ? "Retard de paiement"
                      : "Notification de paiement"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Montant: {notification.amount.toLocaleString()} FCFA
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Date d'échéance:{" "}
                    {format(new Date(notification.due_date), "PP", { locale: fr })}
                  </p>
                </div>
                <Badge variant={notification.is_read ? "secondary" : "default"}>
                  {notification.is_read ? "Lu" : "Non lu"}
                </Badge>
              </div>
            ))}
            {data.notifications.length === 0 && (
              <p className="text-center text-muted-foreground">
                Aucune notification
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}