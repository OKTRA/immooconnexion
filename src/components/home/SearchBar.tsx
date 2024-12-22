import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export function SearchBar() {
  return (
    <div className="max-w-5xl mx-auto p-4 -mt-8 relative z-10">
      <div className="bg-white rounded-lg shadow-lg p-4 flex gap-4 flex-wrap md:flex-nowrap">
        <Select>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Type de bien" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="appartement">Appartement</SelectItem>
            <SelectItem value="maison">Maison</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="studio">Studio</SelectItem>
          </SelectContent>
        </Select>
        
        <Input 
          placeholder="Lieu" 
          className="flex-1"
        />
        
        <Button className="w-full md:w-auto bg-red-500 hover:bg-red-600">
          <Search className="mr-2 h-4 w-4" />
          Rechercher
        </Button>
      </div>
    </div>
  )
}