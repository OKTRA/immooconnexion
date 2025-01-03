import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { StatCard } from "@/components/StatCard"
import { Building2, CircleDollarSign, Users, Bell } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useEffect } from "react"

export function AdminStats() {
  const { toast } = useToast()

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      try {
        const [
          { count: profilesCount },
          { count: propertiesCount },
          { count: tenantsCount },
          { data: contracts },
          { count: unreadNotifications },
        ] = await Promise.all([
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase.from("properties").select("*", { count: "exact", head: true }),
          supabase.from("tenants").select("*", { count: "exact", head: true }),
          supabase.from("contracts").select("montant"),
          supabase.from("admin_payment_notifications")
            .select("*", { count: "exact", head: true })
            .eq("is_read", false),
        ])

        const totalRevenue = contracts?.reduce((sum, contract) => sum + (contract.montant || 0), 0) || 0

        return {
          profiles: profilesCount || 0,
          properties: propertiesCount || 0,
          tenants: tenantsCount || 0,
          revenue: totalRevenue,
          notifications: unreadNotifications || 0,
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
        throw error
      }
    },
  })

  // Subscribe to real-time notifications
  useEffect(() => {
    const channel = supabase
      .channel('admin-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'admin_payment_notifications'
        },
        (payload) => {
          toast({
            title: "Nouveau paiement reçu",
            description: `Paiement de ${payload.new.amount} XOF reçu via ${payload.new.payment_method}`,
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [toast])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <StatCard
        title="Total Utilisateurs"
        value={stats?.profiles.toString() || "0"}
        icon={Users}
      />
      <StatCard
        title="Total Biens"
        value={stats?.properties.toString() || "0"}
        icon={Building2}
      />
      <StatCard
        title="Revenus Totaux"
        value={new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "XOF",
        }).format(stats?.revenue || 0)}
        icon={CircleDollarSign}
      />
      <StatCard
        title="Notifications"
        value={stats?.notifications.toString() || "0"}
        icon={Bell}
      />
    </div>
  )
}