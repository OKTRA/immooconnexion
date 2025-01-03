import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export function AdminNotifications() {
  const { data: notifications = [] } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_payment_notifications")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications des paiements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Paiement {notification.payment_id}
                </p>
                <p className="text-sm text-muted-foreground">
                  Montant: {notification.amount.toLocaleString()} FCFA
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(notification.created_at), "PPp", { locale: fr })}
                </p>
              </div>
              <Badge variant={notification.status === "success" ? "success" : "secondary"}>
                {notification.status}
              </Badge>
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