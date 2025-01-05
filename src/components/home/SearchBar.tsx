import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Globe } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { westafrikanCountries } from "@/utils/countryUtils"

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
        .order('name', { ascending: true })

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
    <div className="max-w-3xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-lg shadow p-4 flex flex-wrap gap-3 items-center border border-gray-100 dark:border-gray-700">
        <Select onValueChange={(value) => onTypeChange?.(value || null)} className="min-w-[140px]">
          <SelectTrigger>
            <SelectValue placeholder="Type de bien" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="appartement">Appartement</SelectItem>
            <SelectItem value="maison">Maison</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="studio">Studio</SelectItem>
          </SelectContent>
        </Select>

        <Select className="min-w-[140px]">
          <SelectTrigger>
            <SelectValue placeholder="Pays" />
          </SelectTrigger>
          <SelectContent>
            {westafrikanCountries.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input 
          placeholder="Ville ou quartier" 
          className="max-w-[200px]"
          onChange={(e) => onLocationChange?.(e.target.value)}
        />

        <Button 
          size="sm"
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}