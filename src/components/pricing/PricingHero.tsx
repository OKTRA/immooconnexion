import { Button } from "@/components/ui/button"
import { Download, Apple, Windows } from "lucide-react"

export function PricingHero() {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Des Plans Adaptés à Vos Besoins
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Choisissez le plan qui correspond le mieux à votre activité. 
            Tous nos plans incluent une période d'essai de 14 jours.
          </p>

          {/* Download Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-start">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              asChild
            >
              <a href="https://github.com/OKTRA/immoo/releases/latest/download/Immoo.exe" 
                 target="_blank" 
                 rel="noopener noreferrer"
              >
                <Windows className="w-4 h-4" />
                Windows
              </a>
            </Button>
            
            <Button 
              variant="outline" 
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
    </div>
  )
}