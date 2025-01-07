import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

export function PaymentNotifications() {
  const { data: notifications = [], refetch } = useQuery({
    queryKey: ["payment-notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_notifications")
        .select(`
          *,
          tenant:tenants(nom, prenom),
          lease:apartment_leases(
            unit:apartment_units(
              unit_number,
              apartment:apartments(name)
            )
          )
        `)
        .order("due_date", { ascending: true })
        .eq("is_read", false)

      if (error) throw error
      return data
    },
  })

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("payment_notifications")
        .update({ is_read: true })
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Notification marquée comme lue",
        description: "La notification a été archivée avec succès",
      })

      refetch()
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'archivage de la notification",
        variant: "destructive",
      })
    }
  }

  const getNotificationTitle = (type: string) => {
    switch (type) {
      case "upcoming_payment":
        return "Paiement à venir"
      case "late_payment":
        return "Paiement en retard"
      case "deposit_return":
        return "Retour de caution"
      default:
        return "Notification"
    }
  }

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "upcoming_payment":
        return "default"
      case "late_payment":
        return "destructive"
      case "deposit_return":
        return "secondary"
      default:
        return "default"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications de paiement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={getBadgeVariant(notification.type)}>
                    {getNotificationTitle(notification.type)}
                  </Badge>
                </div>
                <p className="font-medium">
                  {notification.tenant?.prenom} {notification.tenant?.nom}
                </p>
                <p className="text-sm text-muted-foreground">
                  {notification.lease?.unit?.apartment?.name} - Unité{" "}
                  {notification.lease?.unit?.unit_number}
                </p>
                <p className="text-sm">
                  Montant: {notification.amount.toLocaleString()} FCFA
                </p>
                <p className="text-xs text-muted-foreground">
                  Date d'échéance:{" "}
                  {format(new Date(notification.due_date), "PP", { locale: fr })}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAsRead(notification.id)}
              >
                Marquer comme lu
              </Button>
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Aucune notification
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}