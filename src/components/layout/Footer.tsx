import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  className?: string
}

interface GitHubRelease {
  tag_name: string
  name: string
  published_at: string
}

export function Footer({ className, ...props }: FooterProps) {
  const [version, setVersion] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReleaseData = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/OKTRA/immoo/releases/latest"
        )
        
        if (!response.ok) {
          // If no releases found, just set a default version
          if (response.status === 404) {
            setVersion("1.0.0")
            return
          }
          throw new Error(`GitHub API returned ${response.status}`)
        }

        const data: GitHubRelease = await response.json()
        setVersion(data.tag_name)
      } catch (error) {
        console.error("Error fetching release:", error)
        // Set a default version if there's an error
        setVersion("1.0.0")
      }
    }

    fetchReleaseData()
  }, [])

  return (
    <footer className={cn(className)} {...props}>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
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
            . The source code is available on{" "}
            <a
              href="https://github.com/OKTRA/immoo"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
        {version && (
          <p className="text-sm text-muted-foreground">Version {version}</p>
        )}
      </div>
    </footer>
  )
}