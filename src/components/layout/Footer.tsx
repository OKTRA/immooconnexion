import { Button } from "@/components/ui/button"
import { Download, Apple } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by{" "}
          <a
            href="https://oktra.fr"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            OKTRA
          </a>
        </p>

        <div className="flex flex-col items-center gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            Téléchargez notre application pour une meilleure expérience
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
              asChild
            >
              <a href="https://github.com/OKTRA/immoo/releases/latest/download/Immoo.exe" 
                 target="_blank" 
                 rel="noopener noreferrer"
              >
                <Download className="w-4 h-4" />
                Windows
              </a>
            </Button>
            
            <Button 
              variant="outline"
              size="sm" 
              className="flex items-center gap-2"
              asChild
            >
              <a href="https://github.com/OKTRA/immoo/releases/latest/download/Immoo.dmg" 
                 target="_blank" 
                 rel="noopener noreferrer"
              >
                <Apple className="w-4 h-4" />
                MacOS
              </a>
            </Button>
            
            <Button 
              variant="outline"
              size="sm" 
              className="flex items-center gap-2"
              asChild
            >
              <a href="https://github.com/OKTRA/immoo/releases/latest/download/Immoo.AppImage" 
                 target="_blank" 
                 rel="noopener noreferrer"
              >
                <Download className="w-4 h-4" />
                Linux
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}