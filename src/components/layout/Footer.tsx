import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export function Footer() {
  const handleDownload = async (platform: string) => {
    try {
      // Récupérer la dernière release depuis l'API GitHub
      const response = await fetch('https://api.github.com/repos/immoov-organization/desktop-app/releases/latest')
      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: "Application en cours de déploiement",
            description: "L'application desktop sera bientôt disponible au téléchargement. Merci de votre patience.",
          })
          return
        }
        throw new Error('Impossible de récupérer la dernière version')
      }
      
      const release = await response.json()
      
      // Trouver le bon asset selon la plateforme
      const asset = release.assets.find((asset: any) => {
        switch (platform) {
          case 'windows':
            return asset.name.endsWith('.exe')
          case 'mac':
            return asset.name.endsWith('.dmg')
          case 'linux':
            return asset.name.endsWith('.AppImage')
          default:
            return false
        }
      })

      if (!asset) {
        toast({
          title: "Version non disponible",
          description: `La version ${platform} n'est pas encore disponible. Elle sera bientôt disponible.`,
          variant: "destructive"
        })
        return
      }

      // Créer un lien temporaire pour le téléchargement
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
    <footer className="bg-gray-100 dark:bg-gray-800 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-2">Télécharger l'application</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Disponible pour Windows, Mac et Linux
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              variant="outline"
              onClick={() => handleDownload('windows')}
              className="min-w-[120px]"
            >
              Windows
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleDownload('mac')}
              className="min-w-[120px]"
            >
              macOS
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleDownload('linux')}
              className="min-w-[120px]"
            >
              Linux
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}