import { useLocation, Link } from "react-router-dom"
import { Building2, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedLogo } from "@/components/header/AnimatedLogo"

export function PublicHeader() {
  const location = useLocation()
  const isLoginPage = ['/login', '/super-admin/login'].includes(location.pathname)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex-shrink-0">
            <Link to="/public" className="flex items-center">
              <AnimatedLogo />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/public" 
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2 font-medium"
            >
              <Building2 className="h-4 w-4" />
              Propriétés
            </Link>
            <Link 
              to="/pricing" 
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2 font-medium"
            >
              <DollarSign className="h-4 w-4" />
              Tarification
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {!isLoginPage && (
              <Link to="/login">
                <Button variant="default" size="sm">
                  Espace propriétaire
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden border-t border-gray-200">
        <div className="flex justify-around py-2">
          <Link 
            to="/public" 
            className="text-gray-600 hover:text-gray-900 flex flex-col items-center text-xs"
          >
            <Building2 className="h-5 w-5 mb-1" />
            Propriétés
          </Link>
          <Link 
            to="/pricing" 
            className="text-gray-600 hover:text-gray-900 flex flex-col items-center text-xs"
          >
            <DollarSign className="h-5 w-5 mb-1" />
            Tarification
          </Link>
        </div>
      </div>
    </header>
  )
}