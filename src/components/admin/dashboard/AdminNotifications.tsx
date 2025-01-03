import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDistance } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export function AdminNotifications() {
  const { data: notifications, refetch } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_payment_notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) throw error
      return data
    },
  })

  const markAsRead = async (id: string) => {
    await supabase
      .from("admin_payment_notifications")
      .update({ is_read: true })
      .eq("id", id)
    refetch()
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Méthode</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notifications?.map((notification) => (
            <TableRow key={notification.id}>
              <TableCell>
                {formatDistance(new Date(notification.created_at), new Date(), {
                  addSuffix: true,
                  locale: fr,
                })}
              </TableCell>
              <TableCell>
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "XOF",
                }).format(notification.amount)}
              </TableCell>
              <TableCell>{notification.payment_method}</TableCell>
              <TableCell>{notification.status}</TableCell>
              <TableCell>
                {!notification.is_read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}