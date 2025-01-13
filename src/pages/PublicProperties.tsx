import { HomeBanner } from "@/components/home/HomeBanner"
import { PropertiesGrid } from "@/components/home/PropertiesGrid"
import { SearchBar } from "@/components/home/SearchBar"
import { PublicNavbar } from "@/components/home/PublicNavbar"

export default function PublicProperties() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />
      <main className="container mx-auto px-4 py-8">
        <HomeBanner />
        <SearchBar />
        <PropertiesGrid />
      </main>
    </div>
  )
}