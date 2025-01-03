import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface SearchBarProps {
  onAgencyChange?: (agencyId: string | null) => void;
  onTypeChange?: (type: string | null) => void;
  onLocationChange?: (location: string) => void;
}

export function SearchBar({ onAgencyChange, onTypeChange, onLocationChange }: SearchBarProps) {
  const { data: agencies, isError } = useQuery({
    queryKey: ['public-agencies'],
    queryFn: async () => {
      console.log("Fetching public agencies...")
      const { data, error } = await supabase
        .from('agencies')
        .select('id, name')
        .eq('status', 'active')
        .eq('list_properties_on_site', true)
        .order('name')

      if (error) {
        console.error("Error fetching agencies:", error)
        throw error
      }

      console.log("Agencies fetched:", data)
      return data || []
    },
    meta: {
      onError: (error: Error) => {
        console.error("Query error:", error)
        toast.error("Impossible de charger la liste des agences")
      }
    }
  })

  return (
    <div className="max-w-5xl mx-auto p-4 -mt-8 relative z-10">
      <div className="bg-white rounded-lg shadow-lg p-4 flex gap-4 flex-wrap md:flex-nowrap">
        <Select onValueChange={(value) => onTypeChange?.(value || null)}>
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

        <Select onValueChange={(value) => onAgencyChange?.(value || null)}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Agence" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les agences</SelectItem>
            {agencies?.map((agency) => (
              <SelectItem key={agency.id} value={agency.id}>
                {agency.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Input 
          placeholder="Lieu" 
          className="flex-1"
          onChange={(e) => onLocationChange?.(e.target.value)}
        />
        
        <Button className="w-full md:w-auto bg-red-500 hover:bg-red-600">
          <Search className="mr-2 h-4 w-4" />
          Rechercher
        </Button>
      </div>
    </div>
  )
}