import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { AgencyTable } from "./agency/AgencyTable"
import { Agency } from "./agency/types"

export function AdminAgencies() {
  const { toast } = useToast()
  const { data: agencies = [], refetch } = useQuery({
    queryKey: ["admin-agencies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agencies")
        .select("*")
        .order("name")
      
      if (error) throw error
      return data
    },
  })

  const handleEditAgency = async (editedAgency: Agency) => {
    try {
      const { error } = await supabase
        .from("agencies")
        .update({
          name: editedAgency.name,
          address: editedAgency.address,
          phone: editedAgency.phone,
          email: editedAgency.email,
          subscription_plan_id: editedAgency.subscription_plan_id,
          show_phone_on_site: editedAgency.show_phone_on_site,
          list_properties_on_site: editedAgency.list_properties_on_site,
        })
        .eq("id", editedAgency.id)

      if (error) throw error

      toast({
        title: "Agence mise à jour",
        description: "L'agence a été mise à jour avec succès",
      })
      refetch()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour de l'agence",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <AgencyTable 
        agencies={agencies}
        onEdit={handleEditAgency}
        refetch={refetch}
      />
    </div>
  )
}