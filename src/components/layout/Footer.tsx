import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function Footer() {
  const { toast } = useToast()

  const handleDownload = async (platform: string) => {
    try {
      let downloadUrl = ""
      
      // Get the latest release URL based on platform
      const owner = process.env.GITHUB_REPOSITORY_OWNER || 'your-org'
      const repo = process.env.GITHUB_REPOSITORY_NAME || 'your-repo'
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`)
      const release = await response.json()

      if (!release.assets) {
        throw new Error("No release assets found")
      }

      // Find the correct asset for the platform
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
        throw new Error(`No release found for ${platform}`)
      }

      // Trigger download
      window.location.href = asset.browser_download_url

      toast({
        title: "Téléchargement démarré",
        description: `Le téléchargement pour ${platform} a commencé`
      })

    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Erreur de téléchargement",
        description: "Une erreur est survenue lors du téléchargement. Veuillez réessayer plus tard.",
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