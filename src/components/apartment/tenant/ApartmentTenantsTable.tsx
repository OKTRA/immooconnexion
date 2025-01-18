import { Table } from "@/components/ui/table"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { TenantActionButtons } from "./TenantActionButtons"
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useNavigate } from "react-router-dom"

interface ApartmentTenantsTableProps {
  apartmentId?: string
  onEdit: (tenant: any) => void
  onDelete: (tenantId: string) => void
  isLoading?: boolean
}

export function ApartmentTenantsTable({
  apartmentId,
  onEdit,
  onDelete,
  isLoading: externalLoading
}: ApartmentTenantsTableProps) {
  const { toast } = useToast()
  const navigate = useNavigate()

  // Première requête pour obtenir les locataires
  const { data: tenants = [], isLoading: tenantsLoading } = useQuery({
    queryKey: ["apartment-tenants-basic", apartmentId],
    queryFn: async () => {
      console.log("Fetching tenants for apartment:", apartmentId)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: profile } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile?.agency_id) {
        throw new Error("Aucune agence associée")
      }

      let query = supabase
        .from("apartment_tenants")
        .select(`
          id,
          first_name,
          last_name,
          email,
          phone_number
        `)
        .eq("agency_id", profile.agency_id)

      if (apartmentId && apartmentId !== "all") {
        query = query.eq("unit_id", apartmentId)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching tenants:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les locataires",
          variant: "destructive",
        })
        throw error
      }

      return data || []
    },
    enabled: !externalLoading
  })

  // Deuxième requête pour obtenir les baux actifs
  const { data: activeLeases = [] } = useQuery({
    queryKey: ["active-leases", tenants],
    queryFn: async () => {
      if (!tenants.length) return []

      const { data, error } = await supabase
        .from("apartment_leases")
        .select('tenant_id, rent_amount')
        .eq('status', 'active')
        .in('tenant_id', tenants.map(t => t.id))

      if (error) {
        console.error("Error fetching leases:", error)
        throw error
      }

      return data || []
    },
    enabled: tenants.length > 0
  })

  // Combiner les données
  const tenantsWithLeases = tenants.map(tenant => ({
    ...tenant,
    apartment_leases: activeLeases.filter(lease => lease.tenant_id === tenant.id)
  }))

  if (externalLoading || tenantsLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Loyer</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenantsWithLeases.map((tenant) => (
            <TableRow 
              key={tenant.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => navigate(`/agence/apartment-tenants/${tenant.id}`)}
            >
              <TableCell>{tenant.last_name}</TableCell>
              <TableCell>{tenant.first_name}</TableCell>
              <TableCell>{tenant.phone_number || "-"}</TableCell>
              <TableCell>{tenant.email || "-"}</TableCell>
              <TableCell>
                {tenant.apartment_leases?.[0]?.rent_amount?.toLocaleString()} FCFA
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <TenantActionButtons
                  tenant={tenant}
                  currentLease={tenant.apartment_leases?.[0]}
                  onEdit={() => onEdit(tenant)}
                  onDelete={() => onDelete(tenant.id)}
                  onInspection={() => {}}
                />
              </TableCell>
            </TableRow>
          ))}
          {tenantsWithLeases.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                Aucun locataire trouvé
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}