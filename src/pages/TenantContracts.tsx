import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { TenantContracts } from "@/components/TenantContracts"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

const TenantContractsPage = () => {
  const { id } = useParams()

  const { data: tenant } = useQuery({
    queryKey: ["tenant", id],
    queryFn: async () => {
      console.log("Fetching tenant:", id)

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single()

      if (profileError) {
        console.error("Error fetching profile:", profileError)
        throw profileError
      }

      console.log("Profile data:", profileData)
      return profileData
    },
  })

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