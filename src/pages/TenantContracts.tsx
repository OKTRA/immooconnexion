import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { TenantContracts } from "@/components/TenantContracts"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"

const TenantContractsPage = () => {
  const { id } = useParams()

  const { data: tenant, isLoading, error } = useQuery({
    queryKey: ["tenant", id],
    queryFn: async () => {
      if (!id) throw new Error("ID du locataire non fourni")

      console.log("Fetching tenant:", id)

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle()

      if (profileError) {
        console.error("Error fetching profile:", profileError)
        throw profileError
      }

      console.log("Profile data:", profileData)
      return profileData
    },
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Une erreur est survenue lors du chargement des données
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">
              Contrats de {tenant?.first_name} {tenant?.last_name}
            </h1>
          </div>

          <TenantContracts />
        </main>
      </div>
    </SidebarProvider>
  )
}

export default TenantContractsPage