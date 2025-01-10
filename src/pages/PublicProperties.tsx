import { PublicHeader } from "@/components/layout/PublicHeader"
import { HomeBanner } from "@/components/home/HomeBanner"
import { PropertiesGrid } from "@/components/home/PropertiesGrid"
import { Footer } from "@/components/layout/Footer"

export default function PublicProperties() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1 container py-8">
        <HomeBanner />
        <PropertiesGrid />
      </main>
      <Footer />
    </div>
  )
}