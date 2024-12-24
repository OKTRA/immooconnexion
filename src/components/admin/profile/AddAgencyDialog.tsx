import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AgencyFields } from "./AgencyFields"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { AgencyLogoUpload } from "./form/AgencyLogoUpload"

interface AddAgencyDialogProps {
  showDialog: boolean
  setShowDialog: (show: boolean) => void
  onAgencyCreated?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AddAgencyDialog({ 
  showDialog, 
  setShowDialog, 
  onAgencyCreated,
  open,
  onOpenChange 
}: AddAgencyDialogProps) {
  const isOpen = open ?? showDialog
  const handleOpenChange = onOpenChange ?? setShowDialog

  const [agencyData, setAgencyData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    subscription_plan_id: "",
    show_phone_on_site: false,
    list_properties_on_site: false,
  })
  const { toast } = useToast()

  const handleCreateAgency = async () => {
    try {
      if (!agencyData.name) {
        toast({
          title: "Erreur",
          description: "Le nom de l'agence est obligatoire",
          variant: "destructive",
        })
        return
      }

      if (!agencyData.subscription_plan_id) {
        toast({
          title: "Erreur",
          description: "Le plan d'abonnement est obligatoire",
          variant: "destructive",
        })
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour créer une agence",
          variant: "destructive",
        })
        return
      }

      // Create agency with a single insert operation
      const { error: insertError } = await supabase
        .from('agencies')
        .insert([{
          ...agencyData,
          current_properties_count: 0,
          current_tenants_count: 0,
          current_profiles_count: 0
        }])

      if (insertError) {
        console.error('Error creating agency:', insertError)
        throw insertError
      }

      toast({
        title: "Agence créée",
        description: "L'agence a été créée avec succès",
      })
      
      handleOpenChange(false)
      setAgencyData({
        name: "",
        address: "",
        phone: "",
        email: "",
        subscription_plan_id: "",
        show_phone_on_site: false,
        list_properties_on_site: false,
      })
      
      if (onAgencyCreated) {
        onAgencyCreated()
      }
    } catch (error: any) {
      console.error('Error creating agency:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création de l'agence",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle agence</DialogTitle>
        </DialogHeader>
        <AgencyFields agencyData={agencyData} setAgencyData={setAgencyData} />
        <AgencyLogoUpload agencyId={null} />
        <Button onClick={handleCreateAgency} className="w-full">
          Créer l'agence
        </Button>
      </DialogContent>
    </Dialog>
  )
}