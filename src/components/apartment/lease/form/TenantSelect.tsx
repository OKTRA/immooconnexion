import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TenantSelectProps {
  value: string
  onChange: (value: string) => void
}

export function TenantSelect({ value, onChange }: TenantSelectProps) {
  const { data: tenants = [], isLoading } = useQuery({
    queryKey: ["apartment-tenants"],
    queryFn: async () => {
      const { data: profile } = await supabase.auth.getUser()
      
      if (!profile.user) {
        throw new Error("Non authentifié")
      }

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", profile.user.id)
        .single()

      if (!userProfile?.agency_id) {
        throw new Error("Aucune agence associée")
      }

      const { data, error } = await supabase
        .from("apartment_tenants")
        .select("*")
        .eq("agency_id", userProfile.agency_id)
        .eq("status", "active")

      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return <div>Chargement des locataires...</div>
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Sélectionner un locataire" />
      </SelectTrigger>
      <SelectContent>
        {tenants.map((tenant) => (
          <SelectItem key={tenant.id} value={tenant.id}>
            {tenant.first_name} {tenant.last_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}