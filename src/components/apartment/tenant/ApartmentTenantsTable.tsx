import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Receipt, CreditCard } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useNavigate } from "react-router-dom"

interface ApartmentTenantsTableProps {
  tenants: any[]
  isLoading: boolean
  onEdit: (tenant: any) => void
}

export function ApartmentTenantsTable({
  tenants,
  isLoading,
  onEdit,
}: ApartmentTenantsTableProps) {
  const navigate = useNavigate()

  if (isLoading) {
    return <div>Chargement...</div>
  }

  if (!tenants.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun locataire trouvé
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Prénom</TableHead>
          <TableHead>Unité</TableHead>
          <TableHead>Date de naissance</TableHead>
          <TableHead>Téléphone</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tenants.map((tenant) => (
          <TableRow key={tenant.id}>
            <TableCell>{tenant.last_name}</TableCell>
            <TableCell>{tenant.first_name}</TableCell>
            <TableCell>Unité {tenant.apartment_units.unit_number}</TableCell>
            <TableCell>
              {tenant.birth_date
                ? format(new Date(tenant.birth_date), "PP", { locale: fr })
                : "-"}
            </TableCell>
            <TableCell>{tenant.phone_number || "-"}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(tenant)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/agence/apartments/tenants/${tenant.id}/recu`)}
                >
                  <Receipt className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/agence/apartments/tenants/${tenant.id}/paiements`)}
                >
                  <CreditCard className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}