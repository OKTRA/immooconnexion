import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { AnimatedLogo } from "@/components/header/AnimatedLogo"

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <AnimatedLogo />
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/terms">
              <Button variant="ghost" size="sm">CGU</Button>
            </Link>
            <Link to="/pricing">
              <Button variant="ghost" size="sm">Tarifs</Button>
            </Link>
            <Link to="/agence/login">
              <Button>Connexion</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}