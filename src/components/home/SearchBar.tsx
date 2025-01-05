import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Building2, MapPin, Globe } from "lucide-react"
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
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Type de bien */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-500" />
              Type de bien
            </label>
            <Select onValueChange={(value) => onTypeChange?.(value || null)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="appartement">Appartement</SelectItem>
                <SelectItem value="maison">Maison</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="bureau">Bureau</SelectItem>
                <SelectItem value="local">Local commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pays */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-500" />
              Pays
            </label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner le pays" />
              </SelectTrigger>
              <SelectContent>
                {westafrikanCountries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ville et Quartier */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              Localisation
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Input 
                placeholder="Ville" 
                className="w-full"
                onChange={(e) => onLocationChange?.(e.target.value)}
              />
              <Input 
                placeholder="Quartier" 
                className="w-full"
              />
            </div>
          </div>

          {/* Bouton de recherche */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-transparent dark:text-transparent">
              &nbsp;
            </label>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-300">
              <Search className="mr-2 h-4 w-4" />
              Rechercher
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}