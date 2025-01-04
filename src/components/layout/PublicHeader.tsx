import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { AnimatedLogo } from "@/components/header/AnimatedLogo"

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center gap-4 flex-1">
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
    </header>
  )
}