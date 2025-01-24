import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, AlertCircle } from "lucide-react"
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
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { EditLeaseDialog } from "./EditLeaseDialog"

export function ApartmentLeasesTable() {
  const [leaseToDelete, setLeaseToDelete] = useState<string | null>(null)
  const [leaseToEdit, setLeaseToEdit] = useState<any | null>(null)

  const { data: leases = [], isLoading, refetch } = useQuery({
    queryKey: ["apartment-leases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartment_leases")
        .select(`
          *,
          tenant:apartment_tenants(
            id,
            first_name,
            last_name,
            phone_number
          ),
          unit:apartment_units(
            id,
            unit_number,
            apartment:apartments(
              id,
              name
            )
          )
        `)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching leases:", error)
        throw error
      }

      return data
    },
  })

  const handleDelete = async () => {
    if (!leaseToDelete) return

    try {
      const { error: leaseError } = await supabase
        .from("apartment_leases")
        .delete()
        .eq("id", leaseToDelete)

      if (leaseError) throw leaseError

      // Update unit status to available
      const lease = leases.find(l => l.id === leaseToDelete)
      if (lease?.unit_id) {
        const { error: unitError } = await supabase
          .from("apartment_units")
          .update({ status: "available" })
          .eq("id", lease.unit_id)

        if (unitError) throw unitError
      }

      toast({
        title: "Bail supprimé",
        description: "Le bail a été supprimé avec succès",
      })

      refetch()
    } catch (error: any) {
      console.error("Error deleting lease:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du bail",
        variant: "destructive",
      })
    } finally {
      setLeaseToDelete(null)
    }
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
              <TableRow key={lease.id}>
                <TableCell>
                  {lease.tenant?.first_name} {lease.tenant?.last_name}
                </TableCell>
                <TableCell>{lease.unit?.apartment?.name}</TableCell>
                <TableCell>{lease.unit?.unit_number}</TableCell>
                <TableCell>
                  {format(new Date(lease.start_date), "PP", { locale: fr })}
                </TableCell>
                <TableCell>
                  {lease.end_date
                    ? format(new Date(lease.end_date), "PP", { locale: fr })
                    : "En cours"}
                </TableCell>
                <TableCell>
                  {lease.rent_amount.toLocaleString()} FCFA
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      lease.status === "active"
                        ? "bg-green-50 text-green-700"
                        : lease.status === "expired"
                        ? "bg-red-50 text-red-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {lease.status === "active"
                      ? "Actif"
                      : lease.status === "expired"
                      ? "Expiré"
                      : "En attente"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setLeaseToEdit(lease)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setLeaseToDelete(lease.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
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

      <AlertDialog open={!!leaseToDelete} onOpenChange={() => setLeaseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce bail ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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