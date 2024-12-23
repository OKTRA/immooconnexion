import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AgencySelectProps {
  value: string
  onChange: (value: string) => void
}

export function AgencySelect({ value, onChange }: AgencySelectProps) {
  const { data: agencies = [] } = useQuery({
    queryKey: ["agencies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agencies")
        .select("*")
        .order("name")
      
      if (error) throw error
      return data
    }
  })

  return (
    <div>
      <Label htmlFor="agency">Agence</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
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