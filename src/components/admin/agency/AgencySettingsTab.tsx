import { AgencyForm } from "./AgencyForm"
import { Agency } from "./types"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useQueryClient } from "@tanstack/react-query"

interface AgencySettingsTabProps {
  agency: Agency
  onAgencyUpdate: (agency: Agency) => void
}

export function AgencySettingsTab({ agency, onAgencyUpdate }: AgencySettingsTabProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const handleAgencyUpdate = async (updatedAgency: Agency) => {
    try {
      const { error } = await supabase
        .from('agencies')
        .update({
          name: updatedAgency.name,
          address: updatedAgency.address,
          phone: updatedAgency.phone,
          email: updatedAgency.email,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedAgency.id)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Les informations de l'agence ont été mises à jour",
      })

      queryClient.invalidateQueries({ queryKey: ['profile'] })
      onAgencyUpdate(updatedAgency)
    } catch (error: any) {
      console.error('Error updating agency:', error)
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <AgencyForm
      agency={agency}
      setAgency={onAgencyUpdate}
      onSubmit={handleAgencyUpdate}
    />
  )
}