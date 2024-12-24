import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { AgencyTable } from "./agency/AgencyTable"
import { Agency } from "./agency/types"
import { Loader2 } from "lucide-react"

export function AdminAgencies() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)

  const { data: agencies = [], isLoading, error, refetch } = useQuery({
    queryKey: ["admin-agencies"],
    queryFn: async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError) throw authError

        const { data, error } = await supabase
          .from("agencies")
          .select("*, subscription_plans(*)")
          .order("name")

        if (error) {
          console.error("Error fetching agencies:", error)
          throw error
        }

        return data as Agency[]
      } catch (error: any) {
        console.error("Error:", error)
        throw error
      }
    },
  })

  const handleEditAgency = async (editedAgency: Agency) => {
    try {
      setIsEditing(true)
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
        title: "Succès",
        description: "L'agence a été mise à jour avec succès",
      })
      refetch()
    } catch (error: any) {
      console.error("Error updating agency:", error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour de l'agence",
        variant: "destructive",
      })
    } finally {
      setIsEditing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Une erreur est survenue lors du chargement des agences
      </div>
    )
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