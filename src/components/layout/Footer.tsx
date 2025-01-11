import { useEffect, useState } from "react"

export function Footer() {
  const [version, setVersion] = useState("1.0.0")

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        // Since we're getting a 404, let's just use the default version
        // We can update this URL later when the correct repository is available
        console.log("Using default version since repository is not accessible")
        setVersion("1.0.0")
      } catch (error) {
        console.log("Error fetching version:", error)
        // Keep default version if there's an error
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
