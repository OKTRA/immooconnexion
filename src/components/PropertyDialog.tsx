import { Dialog, DialogContent } from "@/components/ui/dialog"
import { PropertyFormFields } from "./property/PropertyFormFields"
import { useState } from "react"
import { PropertyDialogProps, PropertyFormData } from "./property/types"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function PropertyDialog({ 
  property,
  open,
  onOpenChange
}: PropertyDialogProps) {
  const [formData, setFormData] = useState<PropertyFormData>({
    bien: property?.bien || '',
    type: property?.type || '',
    chambres: property?.chambres || 0,
    ville: property?.ville || '',
    loyer: property?.loyer || 0,
    taux_commission: property?.taux_commission || 0,
    caution: property?.caution || 0,
    property_category: property?.property_category || 'house',
    owner_name: property?.owner_name || '',
    owner_phone: property?.owner_phone || '',
    country: property?.country || '',
    quartier: property?.quartier || '',
    owner_id: property?.owner_id || ''
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Image handling logic here
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <PropertyFormFields 
          formData={formData}
          setFormData={setFormData}
          handleImageChange={handleImageChange}
          owners={owners}
        />
      </DialogContent>
    </Dialog>
  )
}