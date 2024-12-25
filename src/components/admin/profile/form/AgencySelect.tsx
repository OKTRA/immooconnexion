import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AgencySelectProps {
  value: string
  onChange: (value: string) => void
  required?: boolean
}

export function AgencySelect({ value, onChange, required = true }: AgencySelectProps) {
  const { data: agencies = [], isLoading } = useQuery({
    queryKey: ["agencies"],
    queryFn: async () => {
      console.log("Fetching agencies...")
      const { data, error } = await supabase
        .from("agencies")
        .select("*")
        .order("name")
      
      if (error) {
        console.error("Error fetching agencies:", error)
        throw error
      }
      
      console.log("Fetched agencies:", data)
      return data || []
    }
  })

  return (
    <div className="space-y-2">
      <Label htmlFor="agency">Agence{required && '*'}</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
        required={required}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner une agence" />
        </SelectTrigger>
        <SelectContent>
          {agencies?.map((agency) => (
            <SelectItem key={agency.id} value={agency.id}>
              {agency.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}