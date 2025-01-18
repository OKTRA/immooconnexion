import { Button } from "@/components/ui/button"
import { Building2, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { ApartmentForm } from "./ApartmentForm"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function EmptyApartmentState() {
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

      const { data: agencyOwners } = await supabase
        .from("agency_owners")
        .select(`
          owner:property_owners (
            id,
            first_name,
            last_name,
            phone_number
          )
        `)
        .eq("agency_id", userProfile.agency_id)

      return agencyOwners?.map(ao => ao.owner) || []
    }
  })

  return (
    <Card className="flex flex-col items-center justify-center p-8 text-center">
      <Building2 className="w-12 h-12 mb-4 text-muted-foreground" />
      <CardTitle className="mb-2">Aucun appartement</CardTitle>
      <CardDescription>
        Vous n'avez pas encore ajouté d'appartement.
        Commencez par en créer un !
      </CardDescription>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Nouvel Appartement
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un appartement</DialogTitle>
          </DialogHeader>
          <ApartmentForm owners={owners} />
        </DialogContent>
      </Dialog>
    </Card>
  )
}