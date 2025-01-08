import { TenantFormData } from "@/types/tenant"

import { TableCell, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { TenantActions } from "./TenantActions"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { TenantReceipt } from "./TenantReceipt"
import { InspectionDialog } from "../inspections/InspectionDialog"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface TenantTableRowProps {
  tenant: {
    id: string
    nom: string
    prenom: string
    dateNaissance: string
    telephone: string
    photoIdUrl?: string
    fraisAgence?: string
  }
  onEdit: (tenant: any) => void
  onDelete: (id: string) => void
}

export function TenantTableRow({ tenant, onEdit, onDelete }: TenantTableRowProps) {
  const [showReceipt, setShowReceipt] = useState(false)
  const [showInspection, setShowInspection] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const { data: contract } = useQuery({
    queryKey: ['tenant-contract', tenant.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contracts')
        .select('*, property:properties(*)')
        .eq('tenant_id', tenant.id)
        .maybeSingle()

      if (error) {
        console.error('Error fetching contract:', error)
        throw error
      }

      return data
    }
  })

  const handleDelete = () => {
    setShowDeleteConfirm(false)
    onDelete(tenant.id)
  }

  const tenantFormData: TenantFormData = {
    id: tenant.id,
    nom: tenant.nom,
    prenom: tenant.prenom,
    telephone: tenant.telephone,
    fraisAgence: tenant.fraisAgence || '0',
    dateNaissance: tenant.dateNaissance,
    photoIdUrl: tenant.photoIdUrl,
    profession: tenant.profession
  };

  return (
    <>
      <TableRow>
        <TableCell>{tenant.nom}</TableCell>
        <TableCell>{tenant.prenom}</TableCell>
        <TableCell>
          {tenant.dateNaissance ? format(new Date(tenant.dateNaissance), 'PP', { locale: fr }) : 'Non renseigné'}
        </TableCell>
        <TableCell>{tenant.telephone}</TableCell>
        <TableCell>
          <TenantActions
            tenant={tenantFormData}
            onEdit={() => onEdit(tenant)}
            onDelete={() => setShowDeleteConfirm(true)}
          />
        </TableCell>
      </TableRow>

      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-3xl">
          <TenantReceipt
            tenant={{
              nom: tenant.nom,
              prenom: tenant.prenom,
              telephone: tenant.telephone,
              fraisAgence: tenant.fraisAgence || "0",
              propertyId: contract?.property_id || "",
            }}
            contractId={contract?.id}
          />
        </DialogContent>
      </Dialog>

      {contract && (
        <InspectionDialog
          contract={contract}
          open={showInspection}
          onOpenChange={setShowInspection}
        />
      )}

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement le locataire {tenant.prenom} {tenant.nom}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
