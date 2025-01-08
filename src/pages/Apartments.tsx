import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { ApartmentHeader } from "@/components/apartment/ApartmentHeader"
import { ApartmentList } from "@/components/apartment/ApartmentList"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ApartmentForm } from "@/components/apartment/ApartmentForm"

export default function Apartments() {
  const navigate = useNavigate()
  
  const { data: apartments = [], isLoading } = useQuery({
    queryKey: ["apartments"],
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

      const { data, error } = await supabase
        .from("apartments")
        .select(`
          id,
          name,
          address,
          total_units
        `)
        .eq("agency_id", userProfile.agency_id)

      if (error) throw error

      return data.map(apartment => ({
        id: apartment.id,
        name: apartment.name,
        address: apartment.address,
        unit_count: apartment.total_units
      }))
    }
  })

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Appartements</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouvel appartement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un appartement</DialogTitle>
              </DialogHeader>
              <ApartmentForm />
            </DialogContent>
          </Dialog>
        </div>
        
        <ApartmentList 
          apartments={apartments}
          isLoading={isLoading}
          onViewUnits={(id) => navigate(`/agence/apartments/${id}/units`)}
        />
      </div>
    </AgencyLayout>
  )
}