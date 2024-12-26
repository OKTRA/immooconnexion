import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { AnimatedLogo } from "@/components/header/AnimatedLogo"
import { Menu } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function PublicNavbar() {
  const NavLinks = () => (
    <div className="flex flex-col md:flex-row gap-4">
      <Link 
        to="/public" 
        className="text-sm font-medium text-gray-700 hover:text-blue-600 py-2 md:py-0"
      >
        Propriétés
      </Link>
      <Link 
        to="/pricing" 
        className="text-sm font-medium text-gray-700 hover:text-blue-600 py-2 md:py-0"
      >
        Tarifs
      </Link>
      <Link to="/login" className="w-full md:w-auto">
        <Button className="w-full md:w-auto">Espace propriétaire</Button>
      </Link>
    </div>
  )

  return (
    <header className="bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 w-full border-b dark:bg-background/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/public" className="text-2xl font-bold">
            <AnimatedLogo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
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