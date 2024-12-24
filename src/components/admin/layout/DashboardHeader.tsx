import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function DashboardHeader() {
  const navigate = useNavigate()
  const { toast } = useToast()

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
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Tableau de bord Super Admin</h1>
      <Button 
        variant="ghost" 
        className="text-red-500 hover:text-red-600 hover:bg-red-100"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Déconnexion
      </Button>
    </div>
  )
}