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

  const { data: tenants = [], isLoading: tenantsLoading } = useQuery({
    queryKey: ["apartment-tenants", apartmentId],
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

      const { data: tenantsData, error: tenantsError } = await supabase
        .from("apartment_tenants_with_rent")
        .select(`
          id,
          first_name,
          last_name,
          email,
          phone_number,
          rent_amount
        `)
        .eq("agency_id", profile.agency_id)
        .order('created_at', { ascending: false })

      if (tenantsError) {
        console.error("Error fetching tenants:", tenantsError)
        throw tenantsError
      }

      return tenantsData
    },
    enabled: !externalLoading
  })

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
          {tenants.map((tenant) => (
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
                {tenant.rent_amount?.toLocaleString()} FCFA
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <TenantActionButtons
                  tenant={tenant}
                  onEdit={() => onEdit(tenant)}
                  onDelete={() => onDelete(tenant.id)}
                  onInspection={() => {}}
                />
              </TableCell>
            </TableRow>
          ))}
          {tenants.length === 0 && (
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