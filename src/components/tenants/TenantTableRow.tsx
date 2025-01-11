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
  tenant: TenantFormData;
  onEdit: () => void;
  onDelete: (id: string) => Promise<void>;
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

  const handleDelete = async () => {
    setShowDeleteConfirm(false);
    if (tenant.id) {
      await onDelete(tenant.id);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>{tenant.first_name}</TableCell>
        <TableCell>{tenant.last_name}</TableCell>
        <TableCell>
          {tenant.birth_date ? format(new Date(tenant.birth_date), 'PP', { locale: fr }) : 'Non renseigné'}
        </TableCell>
        <TableCell>{tenant.phone_number}</TableCell>
        <TableCell>
          <TenantActions
            tenant={tenant}
            onEdit={onEdit}
            onDelete={() => setShowDeleteConfirm(true)}
          />
        </TableCell>
      </TableRow>
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-3xl">
          <TenantReceipt
            tenant={{
              first_name: tenant.first_name,
              last_name: tenant.last_name,
              phone_number: tenant.phone_number,
              agency_fees: tenant.agency_fees,
              property_id: tenant.property_id,
              profession: tenant.profession
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
              Cette action ne peut pas être annulée. Cela supprimera définitivement le locataire {tenant.first_name} {tenant.last_name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}