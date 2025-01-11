import { useEffect, useState } from "react"

export function Footer() {
  const [version, setVersion] = useState("1.0.0")

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        // Only attempt to fetch if we're not in development
        if (import.meta.env.DEV) {
          console.log("Development mode - using default version")
          return
        }

        const response = await fetch("https://api.github.com/repos/OKTRA/immoo/releases/latest")
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`)
        }
        const data = await response.json()
        setVersion(data.tag_name)
      } catch (error) {
        // Log the error but don't let it break the UI
        console.log("Using default version since repository is not accessible")
        // Keep using the default version set in state
      }
    }

    fetchVersion()
  }, [])

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
          . Version {version}
        </p>
      </div>
    </footer>
  )
}
