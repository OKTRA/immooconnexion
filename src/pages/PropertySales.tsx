import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { PropertySalesTabs } from "@/components/property-sales/PropertySalesTabs"
import { Button } from "@/components/ui/button"
import { Plus, LogOut, Moon, Sun } from "lucide-react"
import { useState } from "react"
import { PropertySaleDialog } from "@/components/property-sales/PropertySaleDialog"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useTheme } from "next-themes"
import { AnimatedLogo } from "@/components/header/AnimatedLogo"
import { useQuery } from "@tanstack/react-query"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const PropertySales = () => {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()

  const { data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle()

      return data
    },
  })

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      navigate("/login")
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      })
    } catch (error) {
      console.error('Logout error:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive"
      })
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <AnimatedLogo />
                <Separator orientation="vertical" className="h-6" />
                <h1 className="text-xl font-semibold">Gestion des Ventes</h1>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 mr-4">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {profile?.first_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">
                      {profile?.first_name || profile?.email || 'Utilisateur'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {profile?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  className="text-red-500 hover:text-red-600 hover:bg-red-100"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Déconnexion</span>
                </Button>
              </div>
            </div>
          </header>

          <main className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle vente
              </Button>
            </div>

            <PropertySalesTabs />

            <PropertySaleDialog
              propertyId=""
              open={showAddDialog}
              onOpenChange={setShowAddDialog}
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default PropertySales