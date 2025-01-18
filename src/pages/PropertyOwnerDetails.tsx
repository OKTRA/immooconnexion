import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { OwnerHeader } from "@/components/property-owner/OwnerHeader"
import { RevenuesTab } from "@/components/property-owner/RevenuesTab"
import { ExpensesTab } from "@/components/property-owner/ExpensesTab"
import { StatementsTab } from "@/components/property-owner/StatementsTab"

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

  if (ownerLoading) {
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

        <Tabs defaultValue="revenues">
          <TabsList>
            <TabsTrigger value="revenues">Revenus</TabsTrigger>
            <TabsTrigger value="expenses">Dépenses</TabsTrigger>
            <TabsTrigger value="statements">États financiers</TabsTrigger>
          </TabsList>

          <TabsContent value="revenues">
            <RevenuesTab revenues={revenues} isLoading={revenuesLoading} />
          </TabsContent>

          <TabsContent value="expenses">
            <ExpensesTab expenses={expenses} />
          </TabsContent>

          <TabsContent value="statements">
            <StatementsTab statements={statements} />
          </TabsContent>
        </Tabs>
      </div>
    </AgencyLayout>
  )
}