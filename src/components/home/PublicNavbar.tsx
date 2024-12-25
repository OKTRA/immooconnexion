import { Link, useLocation } from "react-router-dom"
import { AnimatedLogo } from "../header/AnimatedLogo"

export function PublicNavbar() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login' || location.pathname === '/super-admin/login'

  if (isLoginPage) {
    return (
      <header className="bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 w-full border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link to="/public" className="flex items-center">
              <AnimatedLogo />
            </Link>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 w-full border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/public" className="flex items-center">
              <AnimatedLogo />
            </Link>
          </div>
          <nav className="flex items-center gap-6">
            <Link to="/public" className="text-sm font-medium text-gray-700 hover:text-blue-600">
              Propriétés
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-gray-700 hover:text-blue-600">
              Tarifs
            </Link>
            <Link to="/login" className="text-sm font-medium text-primary hover:text-primary/80">
              Espace propriétaire
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}