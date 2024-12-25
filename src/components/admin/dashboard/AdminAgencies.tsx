import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { AgencyTable } from "../agency/AgencyTable"
import { Agency } from "../agency/types"
import { Loader2 } from "lucide-react"

export function AdminAgencies() {
  const { toast } = useToast()

  const { data: agencies = [], isLoading, error, refetch } = useQuery({
    queryKey: ["admin-agencies"],
    queryFn: async () => {
      try {
        // First check if user is authenticated
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError
        if (!session) throw new Error("Veuillez vous connecter")

        // Then verify super admin status
        const { data: adminData, error: adminError } = await supabase
          .from("administrators")
          .select("is_super_admin")
          .eq("id", session.user.id)
          .maybeSingle()

        if (adminError) throw adminError
        if (!adminData?.is_super_admin) {
          throw new Error("Accès non autorisé. Seuls les super administrateurs peuvent accéder à cette page.")
        }

        // Finally fetch agencies data
        const { data, error } = await supabase
          .from("agencies")
          .select("*, subscription_plans(*)")
          .order("name")

        if (error) throw error
        return data as Agency[]
      } catch (error: any) {
        console.error("Error fetching agencies:", error)
        throw new Error(error.message || "Une erreur est survenue lors du chargement des agences")
      }
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
        {error instanceof Error ? error.message : "Une erreur est survenue lors du chargement des agences"}
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