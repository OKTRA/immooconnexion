import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function Footer() {
  const handleDownload = (platform: string) => {
    // Temporairement, on affiche juste un message
    console.log(`Téléchargement pour ${platform} sera bientôt disponible`)
    alert("Le téléchargement sera bientôt disponible")
  }

  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center gap-4 py-10">
        <div className="flex flex-col items-center gap-4 px-4 text-center sm:px-6 lg:px-8">
          <h3 className="text-lg font-semibold">Téléchargez notre application desktop</h3>
          <p className="text-sm text-muted-foreground">
            Gérez votre portefeuille immobilier depuis votre ordinateur
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" onClick={() => handleDownload('windows')}>
              <Download className="mr-2 h-4 w-4" />
              Windows
            </Button>
            <Button variant="outline" onClick={() => handleDownload('macos')}>
              <Download className="mr-2 h-4 w-4" />
              macOS
            </Button>
            <Button variant="outline" onClick={() => handleDownload('linux')}>
              <Download className="mr-2 h-4 w-4" />
              Linux
            </Button>
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Immoo. Tous droits réservés.
        </div>
      </div>
    </footer>
  )
}