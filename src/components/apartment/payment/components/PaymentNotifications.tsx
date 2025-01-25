import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "@/hooks/use-toast"

interface PaymentNotificationsProps {
  leaseId: string
}

export function PaymentNotifications({ leaseId }: PaymentNotificationsProps) {
  const { data: notifications = [] } = useQuery({
    queryKey: ["payment-notifications", leaseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_notifications")
        .select("*")
        .eq("lease_id", leaseId)
        .order("created_at", { ascending: false })

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les notifications",
          variant: "destructive",
        })
        throw error
      }

      return data
    },
  })

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from("payment_notifications")
      .update({ is_read: true })
      .eq("id", notificationId)

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de marquer la notification comme lue",
        variant: "destructive",
      })
      return
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-center justify-between p-4 border rounded-lg ${
                !notification.is_read ? "bg-muted/50" : ""
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div>
                <p className="font-medium">
                  {notification.type === "late_payment"
                    ? "Paiement en retard"
                    : "Paiement à venir"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Montant: {notification.amount.toLocaleString()} FCFA
                </p>
                <p className="text-xs text-muted-foreground">
                  Échéance: {format(new Date(notification.due_date), "PPp", { locale: fr })}
                </p>
              </div>
              {!notification.is_read && (
                <Badge variant="secondary">Nouveau</Badge>
              )}
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="text-center text-muted-foreground">
              Aucune notification
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}