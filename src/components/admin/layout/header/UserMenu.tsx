import { LogOut, Moon, Sun } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function UserMenu() {
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
        .select(`
          *,
          agencies (
            name,
            subscription_plans (
              name
            )
          )
        `)
        .eq("id", user.id)
        .single()

      return data
    },
  })

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      navigate("/super-admin/login")
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
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8 border border-white/20">
              <AvatarFallback className="bg-white/10 text-white">
                {profile?.first_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {profile?.first_name || profile?.email || 'Utilisateur'}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {profile?.email}
              </p>
              {profile?.agencies?.subscription_plans?.name && (
                <p className="text-xs text-muted-foreground">
                  Plan: {profile.agencies.subscription_plans.name}
                </p>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            <span>Changer le thème</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Déconnexion</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}