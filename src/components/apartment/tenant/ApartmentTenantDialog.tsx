import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ApartmentTenantForm } from "./ApartmentTenantForm"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface ApartmentTenantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenant?: any
  apartmentId: string
}

export function ApartmentTenantDialog({ 
  open, 
  onOpenChange, 
  tenant,
  apartmentId 
}: ApartmentTenantDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSuccess = async (formData: any) => {
    setIsSubmitting(true)
    try {
      if (tenant) {
        const { error } = await supabase
          .from('apartment_tenants')
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone_number: formData.phoneNumber,
            birth_date: formData.birthDate,
          })
          .eq('id', tenant.id)

        if (error) throw error

        toast({
          title: "Succès",
          description: "Le locataire a été modifié avec succès",
        })
      } else {
        const { data: profile } = await supabase.auth.getUser()
        if (!profile.user) throw new Error("Non authentifié")

        const { data: userProfile } = await supabase
          .from('profiles')
          .select('agency_id')
          .eq('id', profile.user.id)
          .single()

        if (!userProfile?.agency_id) throw new Error("Aucune agence associée")

        const { error } = await supabase
          .from('apartment_tenants')
          .insert({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone_number: formData.phoneNumber,
            birth_date: formData.birthDate,
            agency_id: userProfile.agency_id
          })

        if (error) throw error

        toast({
          title: "Succès",
          description: "Le locataire a été ajouté avec succès",
        })
      }

      onOpenChange(false)
    } catch (error: any) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl h-[90vh] md:h-auto p-4 md:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl">
            {tenant ? "Modifier le locataire" : "Ajouter un locataire"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-120px)] md:h-auto pr-4">
          <ApartmentTenantForm
            onSuccess={handleSuccess}
            initialData={tenant}
            isSubmitting={isSubmitting}
            onCancel={() => onOpenChange(false)}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}