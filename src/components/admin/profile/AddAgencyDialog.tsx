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
}

export function AddAgencyDialog({ showDialog, setShowDialog, onAgencyCreated }: AddAgencyDialogProps) {
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

      const { data, error } = await supabase
        .from('agencies')
        .insert([agencyData])
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Agence créée",
        description: "L'agence a été créée avec succès",
      })
      
      setShowDialog(false)
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
        description: "Une erreur est survenue lors de la création de l'agence",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
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