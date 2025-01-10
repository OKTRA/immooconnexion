import { Button } from "@/components/ui/button"
import { Download, Apple } from "lucide-react"

export function PricingHero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Gérez vos biens immobiliers
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Une solution complète pour la gestion de vos propriétés, locataires et paiements
            </p>
          </div>

          <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center mt-6">
            <Button variant="outline" className="flex items-center gap-2">
              <a
                href="/downloads/Immoo-Setup.exe"
                download
                className="flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="w-4 h-4" />
                Windows
              </a>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <a
                href="/downloads/Immoo.dmg"
                download
                className="flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Apple className="w-4 h-4" />
                MacOS
              </a>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <a
                href="/downloads/Immoo.AppImage"
                download
                className="flex items-center gap-2"
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
    </section>
  )
}