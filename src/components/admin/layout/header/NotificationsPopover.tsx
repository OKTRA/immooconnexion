import { Bell, BellDot } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function NotificationsPopover() {
  const { data: notifications } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: async () => {
      const { data } = await supabase
        .from("admin_payment_notifications")
        .select("*")
        .eq("is_read", false)
        .order("created_at", { ascending: false })
        .limit(5)

      return data
    },
  })

  const hasUnreadNotifications = notifications && notifications.length > 0

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 relative"
        >
          {hasUnreadNotifications ? (
            <>
              <BellDot className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                {notifications?.length}
              </span>
            </>
          ) : (
            <Bell className="h-5 w-5" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-2">
          <h4 className="font-medium leading-none mb-3">Notifications</h4>
          {notifications && notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-2 p-2 hover:bg-muted rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm">
                    Nouveau paiement de {notification.amount} FCFA
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Aucune nouvelle notification
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}