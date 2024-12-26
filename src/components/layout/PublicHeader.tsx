import { Link, useLocation } from "react-router-dom"
import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AnimatedLogo } from "@/components/header/AnimatedLogo"

export function PublicHeader() {
  const location = useLocation()
  const isLoginPage = ['/agence/login', '/super-admin/login'].includes(location.pathname)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b dark:bg-background/95 dark:backdrop-blur dark:supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/public" className="flex items-center space-x-2">
              <AnimatedLogo />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/public" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === '/public' ? "text-primary" : "text-gray-600 dark:text-gray-300"
              )}
            >
              <div className="flex items-center space-x-1">
                <Home className="h-4 w-4" />
                <span>Propriétés</span>
              </div>
            </Link>
            <Link 
              to="/pricing" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === '/pricing' ? "text-primary" : "text-gray-600 dark:text-gray-300"
              )}
            >
              Tarifs
            </Link>
            {!isLoginPage && (
              <Link to="/agence/login">
                <Button>Espace propriétaire</Button>
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Link to="/agence/login">
              <Button>Connexion</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}