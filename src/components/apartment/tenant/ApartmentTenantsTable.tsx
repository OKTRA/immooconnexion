import { Table } from "@/components/ui/table"
import { Loader2 } from "lucide-react"
import { TenantsTableHeader } from "@/components/tenants/TenantsTableHeader"
import { TenantsTableContent } from "@/components/tenants/TenantsTableContent"
import { TenantDisplay } from "@/hooks/use-tenants"
import { useToast } from "@/components/ui/use-toast"
import { useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { TenantActionButtons } from "@/components/apartment/tenant/TenantActionButtons"
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ApartmentTenantsTableProps {
  apartmentId: string;
  onEdit: (tenant: any) => void;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function ApartmentTenantsTable({ 
  apartmentId,
  onEdit,
  onDelete,
  isLoading
}: ApartmentTenantsTableProps) {
  const { toast } = useToast()

  const { data: tenants = [], error } = useQuery({
    queryKey: ["apartment-tenants", apartmentId],
    queryFn: async () => {
      const { data, error } = await supabase
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
        .eq(apartmentId !== "all" ? "apartment_id" : "id", apartmentId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Prénom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Téléphone</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tenants.map((tenant) => (
          <TableRow key={tenant.id}>
            <TableCell className="font-mono text-sm">
              {tenant.id.slice(0, 8)}...
            </TableCell>
            <TableCell>{tenant.last_name}</TableCell>
            <TableCell>{tenant.first_name}</TableCell>
            <TableCell>{tenant.email || "-"}</TableCell>
            <TableCell>{tenant.phone_number || "-"}</TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  tenant.apartment_leases?.[0]?.status === "active"
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {tenant.apartment_leases?.[0]?.status === "active" ? "Actif" : "Inactif"}
              </span>
            </TableCell>
            <TableCell>
              <TenantActionButtons
                tenant={tenant}
                currentLease={tenant.apartment_leases?.[0]}
                onEdit={() => onEdit(tenant)}
                onDelete={() => onDelete(tenant.id)}
                onInspection={() => {
                  // Will be implemented in the next iteration
                  toast({
                    title: "Bientôt disponible",
                    description: "Cette fonctionnalité sera disponible prochainement",
                  })
                }}
              />
            </TableCell>
          </TableRow>
        ))}
        {tenants.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4">
              Aucun locataire trouvé
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}