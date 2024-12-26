import { Link, useLocation } from "react-router-dom"
import { Building2, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function PublicHeader() {
  const location = useLocation()
  const isLoginPage = ['/login', '/super-admin/login'].includes(location.pathname)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/public" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">ImmoGest</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/public" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === '/public' ? "text-primary" : "text-gray-600"
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
                location.pathname === '/pricing' ? "text-primary" : "text-gray-600"
              )}
            >
              Tarifs
            </Link>
            {!isLoginPage && (
              <Link to="/login">
                <Button>Espace propriétaire</Button>
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Link to="/login">
              <Button>Connexion</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}