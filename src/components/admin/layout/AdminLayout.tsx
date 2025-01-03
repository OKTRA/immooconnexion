import { ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { DashboardHeader } from "./DashboardHeader"

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data } = await supabase
        .from("profiles")
        .select("*, agencies (*)")
        .eq("id", user.id)
        .maybeSingle()

      return data
    }
  })

  const showWarning = profile?.role === 'admin' && 
    (!profile?.agencies?.name || !profile?.agencies?.address || !profile?.agencies?.phone)

  return (
    <div 
      className="min-h-screen w-full"
      style={{
        background: `linear-gradient(to right, #243949 0%, #517fa4 100%)`,
      }}
    >
      <DashboardHeader />
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-[1400px] animate-fade-in">
        {showWarning && !profile?.has_seen_warning && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-lg">
              Veuillez compléter votre profil avant d'accéder aux autres fonctionnalités
            </AlertDescription>
          </Alert>
        )}
        <div className="rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl p-6">
          {children}
        </div>
      </div>
    </div>
  )
}