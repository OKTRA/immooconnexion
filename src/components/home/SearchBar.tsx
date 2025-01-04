import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Building2, MapPin } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

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
    <div className="max-w-5xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type de bien</label>
            <Select onValueChange={(value) => onTypeChange?.(value || null)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="appartement">
                  <div className="flex items-center">
                    <Building2 className="mr-2 h-4 w-4" />
                    Appartement
                  </div>
                </SelectItem>
                <SelectItem value="maison">Maison</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Agence</label>
            <Select onValueChange={(value) => onAgencyChange?.(value === "all" ? null : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les agences" />
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
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Lieu</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Ville ou quartier" 
                className="pl-9"
                onChange={(e) => onLocationChange?.(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">&nbsp;</label>
            <Button className="w-full bg-primary hover:bg-primary/90">
              <Search className="mr-2 h-4 w-4" />
              Rechercher
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}