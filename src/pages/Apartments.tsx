import { useState, Suspense } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ApartmentForm } from "@/components/apartment/ApartmentForm"
import { EmptyApartmentState } from "@/components/apartment/EmptyApartmentState"
import { ApartmentList } from "@/components/apartment/ApartmentList"

const LoadingState = () => (
  <div className="flex justify-center items-center min-h-[200px]">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
)

export default function Apartments() {
  const [showAddDialog, setShowAddDialog] = useState(false)

  const { data: apartments = [], isLoading } = useQuery({
    queryKey: ['apartments'],
    queryFn: async () => {
      const { data: profile } = await supabase.auth.getUser()
      
      if (!profile.user) {
        throw new Error("Non authentifié")
      }

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", profile.user.id)
        .single()

      if (!userProfile?.agency_id) {
        throw new Error("Aucune agence associée")
      }

      // Optimisation : Sélection uniquement des colonnes nécessaires
      const { data, error } = await supabase
        .from("apartments")
        .select(`
          id,
          name,
          address,
          total_units,
          created_at
        `)
        .eq("agency_id", userProfile.agency_id)
        .order("created_at", { ascending: false })
        .limit(20) // Pagination initiale

      if (error) throw error
      return data.map(apt => ({
        id: apt.id,
        name: apt.name,
        address: apt.address || '',
        unit_count: apt.total_units || 0
      }))
    },
    staleTime: 30 * 1000, // Cache pendant 30 secondes
    gcTime: 5 * 60 * 1000 // Garde en cache pendant 5 minutes
  })

  const { data: owners = [] } = useQuery({
    queryKey: ['property-owners'],
    queryFn: async () => {
      const { data: profile } = await supabase.auth.getUser()
      
      if (!profile.user) {
        throw new Error("Non authentifié")
      }

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", profile.user.id)
        .single()

      if (!userProfile?.agency_id) {
        throw new Error("Aucune agence associée")
      }

      // Optimisation : Sélection uniquement des colonnes nécessaires
      const { data: agencyOwners } = await supabase
        .from("agency_owners")
        .select(`
          owner:property_owners (
            id,
            first_name,
            last_name
          )
        `)
        .eq("agency_id", userProfile.agency_id)

      return agencyOwners?.map(ao => ao.owner) || []
    },
    staleTime: 60 * 1000, // Cache pendant 1 minute
    gcTime: 5 * 60 * 1000 // Garde en cache pendant 5 minutes
  })

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Appartements</h1>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvel Appartement
          </Button>
        </div>

        <Suspense fallback={<LoadingState />}>
          {!apartments.length && !isLoading ? (
            <EmptyApartmentState owners={owners} />
          ) : (
            <ApartmentList 
              apartments={apartments}
              isLoading={isLoading}
              onViewUnits={() => {}}
            />
          )}
        </Suspense>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un appartement</DialogTitle>
            </DialogHeader>
            <ApartmentForm owners={owners} onSuccess={() => setShowAddDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </AgencyLayout>
  )
}