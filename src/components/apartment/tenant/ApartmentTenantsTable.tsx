import { Button } from "@/components/ui/button"
import { Trash, Pencil, Eye } from "lucide-react"
import { ApartmentTenant } from "@/types/apartment"
import { useNavigate } from "react-router-dom"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ApartmentTenantsTableProps {
  apartmentId: string;
  onEdit: (tenant: ApartmentTenant) => void;
  onDelete: (id: string) => Promise<void>;
}

export function ApartmentTenantsTable({ 
  apartmentId,
  onEdit,
  onDelete
}: ApartmentTenantsTableProps) {
  const navigate = useNavigate()

  const { data: tenants = [], isLoading, error } = useQuery({
    queryKey: ["apartment-tenants", apartmentId],
    queryFn: async () => {
      const { data: profile } = await supabase.auth.getUser()
      if (!profile.user) throw new Error("Not authenticated")

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', profile.user.id)
        .maybeSingle()

      if (!userProfile?.agency_id) throw new Error("No agency associated")

      const query = supabase
        .from('apartment_tenants')
        .select('*')
        .eq('agency_id', userProfile.agency_id)

      if (apartmentId !== "all") {
        query.eq('apartment_id', apartmentId)
      }

      const { data, error } = await query

      if (error) throw error
      return data as ApartmentTenant[]
    }
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Une erreur est survenue lors du chargement des locataires
      </div>
    )
  }

  if (!tenants.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun locataire trouvé
      </div>
    )
  }

  const handleViewDetails = (tenantId: string) => {
    navigate(`/agence/apartment-tenants/${tenantId}`)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Prénom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Téléphone</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tenants.map((tenant) => (
          <TableRow key={tenant.id}>
            <TableCell>{tenant.last_name}</TableCell>
            <TableCell>{tenant.first_name}</TableCell>
            <TableCell>{tenant.email || "-"}</TableCell>
            <TableCell>{tenant.phone_number || "-"}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleViewDetails(tenant.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(tenant)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(tenant.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}