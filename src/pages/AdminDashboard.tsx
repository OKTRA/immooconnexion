import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminProfiles } from "@/components/admin/AdminProfiles"
import { AdminProperties } from "@/components/admin/AdminProperties"
import { AdminTenants } from "@/components/admin/AdminTenants"
import { AdminStats } from "@/components/admin/AdminStats"

const AdminDashboard = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const checkSuperAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate("/login")
        return
      }

      const { data: adminData } = await supabase
        .from("administrators")
        .select("is_super_admin")
        .eq("id", user.id)
        .single()

      if (!adminData?.is_super_admin) {
        navigate("/")
      }
    }

    checkSuperAdmin()
  }, [navigate])

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord Super Admin</h1>
      
      <AdminStats />

      <Tabs defaultValue="profiles" className="mt-6">
        <TabsList>
          <TabsTrigger value="profiles">Profils</TabsTrigger>
          <TabsTrigger value="properties">Biens</TabsTrigger>
          <TabsTrigger value="tenants">Locataires</TabsTrigger>
        </TabsList>

        <TabsContent value="profiles">
          <AdminProfiles />
        </TabsContent>

        <TabsContent value="properties">
          <AdminProperties />
        </TabsContent>

        <TabsContent value="tenants">
          <AdminTenants />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminDashboard