import { HomeBanner } from "@/components/home/HomeBanner"
import { SearchBar } from "@/components/home/SearchBar"
import { PropertiesGrid } from "@/components/home/PropertiesGrid"

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        <HomeBanner />
        <SearchBar />
      </div>
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Nos Propriétés d'Exception</h2>
          <PropertiesGrid />
        </div>
      </div>
    </div>
  )
}

export default Index