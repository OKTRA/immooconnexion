import { PublicHeader } from "@/components/layout/PublicHeader"
import { PropertiesGrid } from "@/components/home/PropertiesGrid"
import { SearchBar } from "@/components/home/SearchBar"
import { HomeBanner } from "@/components/home/HomeBanner"

const PublicProperties = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      <HomeBanner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SearchBar />
        <PropertiesGrid />
      </div>
    </div>
  )
}

export default PublicProperties