import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GithubRelease {
  assets: {
    name: string
    browser_download_url: string
  }[]
}

export function Footer() {
  const [downloadUrl, setDownloadUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchReleaseData = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/immoov-organization/desktop-app/releases/tags/V1.0.0"
        )
        
        if (!response.ok) {
          throw new Error(`GitHub API returned ${response.status}`)
        }

        const data: GithubRelease = await response.json()

        // Determine OS and select appropriate download
        const os = window.navigator.platform.toLowerCase()
        let assetName = ""

        if (os.includes("win")) {
          assetName = ".exe"
        } else if (os.includes("mac")) {
          assetName = ".dmg"
        } else {
          assetName = ".AppImage"
        }

        const asset = data.assets.find(a => a.name.endsWith(assetName))
        if (asset) {
          setDownloadUrl(asset.browser_download_url)
        } else {
          toast({
            title: "Version non disponible",
            description: `La version pour votre système d'exploitation n'est pas encore disponible.`,
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error("Error fetching release:", error)
        toast({
          title: "Erreur de téléchargement",
          description: "Impossible de récupérer les informations de téléchargement.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchReleaseData()
  }, [toast])

  return (
    <footer className="w-full border-t">
      <div className="container flex flex-col items-center gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-1 items-center gap-4 px-8 text-center md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <a
              href="https://twitter.com/shadcn"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              IMMOO
            </a>
            . The source code is available on{" "}
            <a
              href="https://github.com/immoov-organization/desktop-app"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
        {downloadUrl && (
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8" 
            onClick={() => window.location.href = downloadUrl}
            disabled={isLoading}
          >
            <Download className="mr-2 h-4 w-4" />
            Télécharger l'application
          </Button>
        )}
      </div>
    </footer>
  )
}