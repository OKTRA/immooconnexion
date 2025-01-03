import { useNavigate } from "react-router-dom"
import { 
  LogOut, 
  Moon, 
  Sun,
  ChartBar,
  Users,
  Building2,
  CreditCard,
  Bell,
  BellDot
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useTheme } from "next-themes"
import { AnimatedLogo } from "@/components/header/AnimatedLogo"
import { useQuery } from "@tanstack/react-query"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DashboardHeader() {
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

  const { data: notifications } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: async () => {
      const { data } = await supabase
        .from("admin_payment_notifications")
        .select("*")
        .eq("is_read", false)
        .order("created_at", { ascending: false })
        .limit(5)

      return data
    },
  })

  const hasUnreadNotifications = notifications && notifications.length > 0

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

  const navItems = [
    { icon: ChartBar, label: "Tableau de bord", path: "/super-admin/admin" },
    { icon: Users, label: "Agents", path: "/super-admin/agents" },
    { icon: Building2, label: "Agences", path: "/super-admin/agencies" },
    { icon: CreditCard, label: "Abonnements", path: "/super-admin/subscriptions" },
  ]

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-dashboard-gradient-from/5 border-b border-white/10">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <AnimatedLogo />
            <Separator orientation="vertical" className="h-6 bg-white/20" />
            <nav className="flex items-center gap-2">
              {navItems.map((item) => (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/10"
                      onClick={() => navigate(item.path)}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      <span className="hidden md:inline">{item.label}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 relative"
                >
                  {hasUnreadNotifications ? (
                    <>
                      <BellDot className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                        {notifications?.length}
                      </span>
                    </>
                  ) : (
                    <Bell className="h-5 w-5" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none mb-3">Notifications</h4>
                  {notifications && notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div key={notification.id} className="flex items-start gap-2 p-2 hover:bg-muted rounded-lg">
                        <div className="space-y-1">
                          <p className="text-sm">
                            Nouveau paiement de {notification.amount} FCFA
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(notification.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Aucune nouvelle notification
                    </p>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border border-white/20">
                <AvatarFallback className="bg-white/10 text-white">
                  {profile?.first_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white">
                  {profile?.first_name || profile?.email || 'Utilisateur'}
                </p>
                <p className="text-xs text-white/70">
                  Super Admin
                </p>
              </div>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="text-white hover:bg-white/10"
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Changer le thème</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Déconnexion</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </header>
    </TooltipProvider>
  )
}