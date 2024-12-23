import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

interface AgencySelectProps {
  value: string
  onChange: (value: string) => void
}

export function AgencySelect({ value, onChange }: AgencySelectProps) {
  const { toast } = useToast()
  const [newAgencyName, setNewAgencyName] = useState("")
  
  const { data: agencies = [], refetch: refetchAgencies } = useQuery({
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

  const handleCreateAgency = async () => {
    try {
      const { data, error } = await supabase
        .from('agencies')
        .insert([{ name: newAgencyName }])
        .select()
        .maybeSingle()

      if (error) throw error

      if (data) {
        onChange(data.id)
        setNewAgencyName("")
        refetchAgencies()
        toast({
          title: "Agence créée",
          description: "L'agence a été créée avec succès",
        })
      }
    } catch (error: any) {
      console.error('Error creating agency:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'agence",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <div>
        <Label htmlFor="agency">Agence existante</Label>
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
      <div>
        <Label htmlFor="new_agency">Ou créer une nouvelle agence</Label>
        <div className="flex gap-2">
          <Input
            id="new_agency"
            value={newAgencyName}
            onChange={(e) => setNewAgencyName(e.target.value)}
            placeholder="Nom de la nouvelle agence"
          />
          <button
            onClick={handleCreateAgency}
            disabled={!newAgencyName}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
            type="button"
          >
            Créer
          </button>
        </div>
      </div>
    </>
  )
}