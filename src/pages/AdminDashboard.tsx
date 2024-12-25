import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { AdminLayout } from "@/components/admin/layout/AdminLayout"
import { DashboardHeader } from "@/components/admin/layout/DashboardHeader"
import { DashboardTabs } from "@/components/admin/layout/DashboardTabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  const { data: adminStatus, isLoading: checkingAdmin } = useQuery({
    queryKey: ["admin-status"],
    queryFn: async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError) throw authError
        if (!user) throw new Error("Non authentifié")

        const { data: adminData, error: adminError } = await supabase
          .from("administrators")
          .select("is_super_admin")
          .eq("id", user.id)
          .maybeSingle()

        if (adminError) throw adminError
        
        // If no admin record found or not super admin, throw error
        if (!adminData?.is_super_admin) {
          throw new Error("Accès non autorisé")
        }

        return adminData
      } catch (error: any) {
        console.error("Admin check error:", error)
        throw error
      }
    },
    retry: false,
  })

  useEffect(() => {
    if (!checkingAdmin && !adminStatus) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les droits nécessaires pour accéder à cette page.",
        variant: "destructive"
      })
      navigate("/login")
    }
  }, [adminStatus, checkingAdmin, navigate, toast])

  if (checkingAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!adminStatus) {
    return null
  }

  return (
    <AdminLayout>
      <DashboardHeader />
      <DashboardTabs />
    </AdminLayout>
  )
}

export default AdminDashboard