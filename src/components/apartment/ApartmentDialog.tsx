import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ApartmentForm } from "./ApartmentForm"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface ApartmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  apartment?: {
    id: string
    name: string
    address: string
    description?: string
    owner_id?: string
  }
}

export function ApartmentDialog({ open, onOpenChange, apartment }: ApartmentDialogProps) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {apartment ? 'Modifier l\'appartement' : 'Ajouter un appartement'}
          </DialogTitle>
        </DialogHeader>
        <ApartmentForm 
          initialData={apartment} 
          onSuccess={() => onOpenChange(false)}
          owners={owners}
        />
      </DialogContent>
    </Dialog>
  )
}