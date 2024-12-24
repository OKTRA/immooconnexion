import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { validateAgencyData } from "./AgencyFormValidation"

export interface AgencyFormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  subscription_plan_id: string;
  show_phone_on_site: boolean;
  list_properties_on_site: boolean;
}

const initialAgencyData: AgencyFormData = {
  name: "",
  address: "",
  phone: "",
  email: "",
  subscription_plan_id: "",
  show_phone_on_site: false,
  list_properties_on_site: false,
}

export const useAgencyForm = (onSuccess?: () => void) => {
  const [agencyData, setAgencyData] = useState<AgencyFormData>(initialAgencyData)
  const { toast } = useToast()

  const resetForm = () => {
    setAgencyData(initialAgencyData)
  }

  const handleCreateAgency = async () => {
    try {
      const validationErrors = validateAgencyData(agencyData)
      if (validationErrors.length > 0) {
        toast({
          title: "Erreur",
          description: validationErrors.join("\n"),
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
      
      resetForm()
      if (onSuccess) {
        onSuccess()
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

  return {
    agencyData,
    setAgencyData,
    handleCreateAgency,
    resetForm
  }
}