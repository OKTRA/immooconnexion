import { HomeBanner } from "@/components/home/HomeBanner"
import { SearchBar } from "@/components/home/SearchBar"
import { PropertiesGrid } from "@/components/home/PropertiesGrid"

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <HomeBanner />
      <SearchBar />
      <div className="py-12">
        <PropertiesGrid />
      </div>
    </div>
  )
}

export default Index