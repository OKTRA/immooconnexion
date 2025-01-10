import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function Footer() {
  const { toast } = useToast()

  const handleDownload = async (platform: string) => {
    try {
      // For now, show a message that the desktop app is not yet available
      toast({
        title: "Application desktop",
        description: "L'application desktop n'est pas encore disponible pour le téléchargement. Elle sera bientôt disponible.",
        duration: 5000,
      })
      
      // TODO: Once the GitHub repository is set up with releases, uncomment this code
      /*
      const response = await fetch('https://api.github.com/repos/immoov-organization/desktop-app/releases/latest')
      if (!response.ok) {
        throw new Error('Impossible de récupérer la dernière version')
      }

      const release = await response.json()
      
      const asset = release.assets.find((asset: any) => {
        switch (platform) {
          case 'windows':
            return asset.name.endsWith('.exe')
          case 'macos':
            return asset.name.endsWith('.dmg')
          case 'linux':
            return asset.name.endsWith('.AppImage')
          default:
            return false
        }
      })

      if (!asset) {
        throw new Error(`Aucune version disponible pour ${platform}`)
      }

      const link = document.createElement('a')
      link.href = asset.browser_download_url
      link.download = asset.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Téléchargement démarré",
        description: `Le téléchargement pour ${platform} a commencé`
      })
      */

    } catch (error: any) {
      console.error("Erreur de téléchargement:", error)
      toast({
        title: "Erreur de téléchargement",
        description: error.message || "Une erreur est survenue lors du téléchargement",
        variant: "destructive"
      })
    }
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