import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Eye, Trash2, Plus, CreditCard, ClipboardList } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { ApartmentTenant } from "@/types/apartment"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { LeaseDialog } from "../lease/LeaseDialog"
import { useState } from "react"
import { DeleteConfirmDialog } from "./actions/DeleteConfirmDialog"

interface ApartmentTenantsTableProps {
  onEdit: (tenant: ApartmentTenant) => void;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function ApartmentTenantsTable({ 
  onEdit,
  onDelete,
  isLoading
}: ApartmentTenantsTableProps) {
  const navigate = useNavigate()
  const [showLeaseDialog, setShowLeaseDialog] = useState(false)
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [tenantToDelete, setTenantToDelete] = useState<string | null>(null)

  const handleViewDetails = (tenantId: string) => {
    navigate(`/agence/apartment-tenants/${tenantId}`)
  }

  const handleCreateLease = (tenantId: string) => {
    setSelectedTenantId(tenantId)
    setShowLeaseDialog(true)
  }

  const handleDelete = async (id: string) => {
    setTenantToDelete(id)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    if (tenantToDelete) {
      await onDelete(tenantToDelete)
      setShowDeleteConfirm(false)
      setTenantToDelete(null)
    }
  }

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Date de naissance</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants?.map((tenant) => (
            <TableRow key={tenant.id}>
              <TableCell>{tenant.last_name}</TableCell>
              <TableCell>{tenant.first_name}</TableCell>
              <TableCell>
                {tenant.birth_date ? format(new Date(tenant.birth_date), 'PP', { locale: fr }) : '-'}
              </TableCell>
              <TableCell>{tenant.phone_number || '-'}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
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
                    <Edit className="h-4 w-4" />
                  </Button>

                  {/* Nouveau bouton de création de bail */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCreateLease(tenant.id)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/agence/apartment-tenants/${tenant.id}/payments`)}
                  >
                    <CreditCard className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/agence/apartment-tenants/${tenant.id}/leases`)}
                  >
                    <ClipboardList className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(tenant.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedTenantId && (
        <LeaseDialog
          open={showLeaseDialog}
          onOpenChange={setShowLeaseDialog}
          tenantId={selectedTenantId}
        />
      )}

      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
      />
    </>
  )
}