import { Dialog, DialogContent } from "@/components/ui/dialog"
import { PropertyFormFields } from "./property/PropertyFormFields"
import { useState } from "react"
import { PropertyDialogProps, PropertyFormData } from "./property/types"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { usePropertyForm } from "./property/usePropertyForm"
import { PropertyOwner } from "@/types/property"

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
    owner_id: property?.owner_id || '',
    living_rooms: property?.living_rooms || 0,
    bathrooms: property?.bathrooms || 0,
    store_count: property?.store_count || 0,
    has_pool: property?.has_pool || false,
    kitchen_count: property?.kitchen_count || 0
  })

  const { handleSubmit } = usePropertyForm(property || null, () => {
    onOpenChange(false)
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
          owner:property_owners!inner (
            id,
            first_name,
            last_name,
            phone_number
          )
        `)
        .eq("agency_id", userProfile.agency_id)

      if (!agencyOwners) return []

      // Transform the data to match the PropertyOwner type
      return agencyOwners.map(ao => ({
        id: ao.owner.id,
        first_name: ao.owner.first_name,
        last_name: ao.owner.last_name,
        phone_number: ao.owner.phone_number
      })) as PropertyOwner[]
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}>
          <PropertyFormFields 
            formData={formData}
            setFormData={setFormData}
            handleImageChange={() => {}}
            owners={owners}
          />
          <div className="mt-6 flex justify-end">
            <Button 
              type="submit" 
              className="bg-primary text-white hover:bg-primary/90"
            >
              {property ? 'Mettre à jour' : 'Ajouter le bien'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}