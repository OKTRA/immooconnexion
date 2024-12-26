import { Link, useLocation } from "react-router-dom"
import { Home, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AnimatedLogo } from "@/components/header/AnimatedLogo"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function PublicHeader() {
  const location = useLocation()
  const isLoginPage = ['/agence/login', '/super-admin/login'].includes(location.pathname)

  const NavLinks = () => (
    <div className="flex flex-col md:flex-row gap-4">
      <Link 
        to="/public" 
        className={cn(
          "flex items-center space-x-1 py-2 md:py-0",
          "text-sm font-medium transition-colors hover:text-primary",
          location.pathname === '/public' ? "text-primary" : "text-gray-600 dark:text-gray-300"
        )}
      >
        <Home className="h-4 w-4" />
        <span>Propriétés</span>
      </Link>
      <Link 
        to="/pricing" 
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary py-2 md:py-0",
          location.pathname === '/pricing' ? "text-primary" : "text-gray-600 dark:text-gray-300"
        )}
      >
        Tarifs
      </Link>
      {!isLoginPage && (
        <Link to="/agence/login" className="w-full md:w-auto">
          <Button className="w-full md:w-auto">Espace propriétaire</Button>
        </Link>
      )}
    </div>
  )

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b dark:bg-background/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/public" className="flex items-center space-x-2">
            <AnimatedLogo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLinks />
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}