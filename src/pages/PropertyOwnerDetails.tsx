import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2, Building2, Home, Receipt, ArrowUpDown } from "lucide-react"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { OwnerHeader } from "@/components/property-owner/OwnerHeader"
import { StatCard } from "@/components/StatCard"
import { RevenueEvolution } from "@/components/reports/RevenueEvolution"
import { PropertyOwnerTabs } from "@/components/property-owner/PropertyOwnerTabs"

export default function PropertyOwnerDetails() {
  const { ownerId } = useParams()

  const { data: owner, isLoading: ownerLoading } = useQuery({
    queryKey: ['property-owner', ownerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_owners')
        .select('*')
        .eq('id', ownerId)
        .single()

      if (error) throw error
      return data
    }
  })

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['owner-dashboard-stats', ownerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('owner_dashboard_stats')
        .select('*')
        .eq('owner_id', ownerId)
        .single()

      if (error) throw error
      return data
    }
  })

  const { data: revenues, isLoading: revenuesLoading } = useQuery({
    queryKey: ['owner-revenues', ownerId],
    queryFn: async () => {
      const { data: propertyRevenues, error: propertyError } = await supabase
        .from('owner_property_revenues')
        .select('*')
        .eq('owner_id', ownerId)
        .order('payment_date', { ascending: false })

      const { data: apartmentRevenues, error: apartmentError } = await supabase
        .from('owner_apartment_revenues')
        .select('*')
        .eq('owner_id', ownerId)
        .order('payment_date', { ascending: false })

      if (propertyError || apartmentError) throw propertyError || apartmentError
      return [...(propertyRevenues || []), ...(apartmentRevenues || [])]
    }
  })

  const { data: expenses } = useQuery({
    queryKey: ['owner-expenses', ownerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('owner_expenses_view')
        .select('*')
        .eq('owner_id', ownerId)
        .order('expense_date', { ascending: false })

      if (error) throw error
      return data
    }
  })

  const { data: statements } = useQuery({
    queryKey: ['owner-statements', ownerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('owner_statements')
        .select('*')
        .eq('owner_id', ownerId)
        .order('period_end', { ascending: false })

      if (error) throw error
      return data
    }
  })

  if (ownerLoading || statsLoading) {
    return (
      <AgencyLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AgencyLayout>
    )
  }

  if (!owner) {
    return (
      <AgencyLayout>
        <div>Propriétaire non trouvé</div>
      </AgencyLayout>
    )
  }

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6 space-y-6">
        <OwnerHeader owner={owner} />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Propriétés"
            value={stats?.total_properties || 0}
            icon={Home}
          />
          <StatCard
            title="Appartements"
            value={stats?.total_apartments || 0}
            icon={Building2}
          />
          <StatCard
            title="Revenus du mois"
            value={`${stats?.current_month_revenue?.toLocaleString() || 0} FCFA`}
            icon={Receipt}
          />
          <StatCard
            title="Taux d'occupation"
            value={`${Math.round(stats?.property_occupancy_rate || 0)}%`}
            icon={ArrowUpDown}
          />
        </div>

        <RevenueEvolution ownerId={ownerId || ''} />

        <PropertyOwnerTabs
          ownerId={ownerId || ''}
          revenues={revenues}
          expenses={expenses}
          statements={statements}
          isLoading={revenuesLoading}
        />
      </div>
    </AgencyLayout>
  )
}