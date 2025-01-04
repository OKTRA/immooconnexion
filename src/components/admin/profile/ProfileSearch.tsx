import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface ProfileSearchProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  selectedAgency: string
  setSelectedAgency: (value: string) => void
}

export function ProfileSearch({ 
  searchTerm, 
  setSearchTerm, 
  selectedAgency, 
  setSelectedAgency 
}: ProfileSearchProps) {
  const { data: agencies = [] } = useQuery({
    queryKey: ["agencies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agencies")
        .select("id, name")
        .order("name")
      
      if (error) throw error
      return data
    }
  })

  return (
    <div className="flex gap-4">
      <Input
        placeholder="Rechercher par nom, prénom, email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <Select value={selectedAgency} onValueChange={setSelectedAgency}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filtrer par agence" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Toutes les agences</SelectItem>
          {agencies.map((agency) => (
            <SelectItem key={agency.id} value={agency.id}>
              {agency.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}