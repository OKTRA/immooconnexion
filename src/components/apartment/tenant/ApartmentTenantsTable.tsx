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
import { ApartmentTenant } from "@/types/apartment"

interface ApartmentTenantsTableProps {
  onEdit: (tenant: ApartmentTenant) => void
  onDelete: (tenantId: string) => void
  isLoading?: boolean
}

export function ApartmentTenantsTable({
  onEdit,
  onDelete,
  isLoading: externalLoading
}: ApartmentTenantsTableProps) {
  const { toast } = useToast()
  const navigate = useNavigate()

  const { data: tenants = [], isLoading: tenantsLoading } = useQuery({
    queryKey: ["apartment-tenants"],
    queryFn: async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
          throw new Error("Non authentifié")
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('agency_id')
          .eq('id', user.id)
          .single()

        if (profileError) {
          throw profileError
        }

        if (!profile?.agency_id) {
          throw new Error("Aucune agence associée")
        }

        // Optimisation : Sélection uniquement des colonnes nécessaires
        const { data: tenantsData, error: tenantsError } = await supabase
          .from("apartment_tenants")
          .select(`
            id,
            first_name,
            last_name,
            email,
            phone_number,
            apartment_leases (
              rent_amount
            )
          `)
          .eq("agency_id", profile.agency_id)
          .order('created_at', { ascending: false })
          .limit(50) // Pagination initiale

        if (tenantsError) {
          console.error("Error fetching tenants:", tenantsError)
          throw tenantsError
        }

        return tenantsData as ApartmentTenant[]
      } catch (error: any) {
        console.error("Error in tenant query:", error)
        toast({
          title: "Erreur",
          description: error.message || "Impossible de charger les locataires",
          variant: "destructive",
        })
        return []
      }
    },
    staleTime: 30000, // Cache pendant 30 secondes
    cacheTime: 5 * 60 * 1000, // Garde en cache pendant 5 minutes
    retry: 1
  })

  const isLoading = externalLoading || tenantsLoading

  if (isLoading) {
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
                {tenant.apartment_leases?.[0]?.rent_amount?.toLocaleString()} FCFA
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