import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { AnimatedLogo } from "@/components/header/AnimatedLogo"
import { Menu, LogOut } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { UserAvatar } from "@/components/admin/layout/header/UserAvatar"
import { LogoutButton } from "@/components/admin/layout/header/LogoutButton"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

export function GlobalHeader() {
  const isMobile = useIsMobile()

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => document.querySelector('.mobile-sidebar')?.classList.toggle('translate-x-0')}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <AnimatedLogo />
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <UserAvatar profile={profile} />
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}