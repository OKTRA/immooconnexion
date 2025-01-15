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
  onDelete: (tenant: any) => void
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

  const { data: tenants = [], isLoading } = useQuery({
    queryKey: ["apartment-tenants", apartmentId],
    queryFn: async () => {
      console.log("Fetching tenants for apartment:", apartmentId)
      
      let query = supabase
        .from("apartment_tenants")
        .select(`
          *,
          apartment_leases (
            id,
            status,
            rent_amount,
            deposit_amount
          )
        `)
        .order("created_at", { ascending: false })

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

      console.log("Tenants data:", data)
      return data || []
    },
    enabled: !externalLoading
  })

  if (externalLoading || isLoading) {
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
                  currentLease={tenant.apartment_leases?.[0]}
                  onEdit={() => onEdit(tenant)}
                  onDelete={() => onDelete(tenant)}
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