import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { AnimatedLogo } from "@/components/header/AnimatedLogo"
import { Menu, ChevronDown } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

export function PublicNavbar() {
  const NavLinks = () => (
    <div className="flex flex-col md:flex-row gap-4">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent">
              Pages <ChevronDown className="h-4 w-4" />
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3 p-4 w-[200px]">
                <NavigationMenuLink asChild>
                  <Link to="/public" className="block p-2 hover:bg-accent rounded-md">
                    Propriétés
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link to="/pricing" className="block p-2 hover:bg-accent rounded-md">
                    Tarifs
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link to="/terms" className="block p-2 hover:bg-accent rounded-md">
                    CGU
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link to="/login" className="block p-2 hover:bg-accent rounded-md">
                    Connexion
                  </Link>
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
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