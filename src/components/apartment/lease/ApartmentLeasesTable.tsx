import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { EditLeaseDialog } from "./EditLeaseDialog"
import { LeaseTableRow } from "./components/LeaseTableRow"
import { DeleteLeaseDialog } from "./components/DeleteLeaseDialog"
import { useLeaseOperations } from "./hooks/useLeaseOperations"

export function ApartmentLeasesTable() {
  const [leaseToDelete, setLeaseToDelete] = useState<string | null>(null)
  const [leaseToEdit, setLeaseToEdit] = useState<any | null>(null)
  
  const { 
    leases, 
    isLoading, 
    generatePaymentPeriods, 
    deleteLease 
  } = useLeaseOperations()

  const handleDelete = async () => {
    if (!leaseToDelete) return
    await deleteLease(leaseToDelete)
    setLeaseToDelete(null)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Locataire</TableHead>
              <TableHead>Appartement</TableHead>
              <TableHead>Unité</TableHead>
              <TableHead>Début</TableHead>
              <TableHead>Fin</TableHead>
              <TableHead>Loyer</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leases.map((lease) => (
              <LeaseTableRow
                key={lease.id}
                lease={lease}
                onEdit={setLeaseToEdit}
                onDelete={setLeaseToDelete}
                onGeneratePaymentPeriods={(id) => generatePaymentPeriods.mutate(id)}
                isGenerating={generatePaymentPeriods.isPending}
              />
            ))}
            {leases.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Aucun bail trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DeleteLeaseDialog
        open={!!leaseToDelete}
        onOpenChange={() => setLeaseToDelete(null)}
        onConfirm={handleDelete}
      />

      {leaseToEdit && (
        <EditLeaseDialog
          lease={leaseToEdit}
          open={!!leaseToEdit}
          onOpenChange={(open) => !open && setLeaseToEdit(null)}
        />
      )}
    </>
  )
}