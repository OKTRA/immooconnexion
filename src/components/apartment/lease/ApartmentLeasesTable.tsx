import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { EditLeaseDialog } from "./EditLeaseDialog"
import { useState } from "react"
import { LeaseActions } from "./table/LeaseActions"
import { LeaseStatus } from "./table/LeaseStatus"
import { DeleteLeaseDialog } from "./table/DeleteLeaseDialog"

export function ApartmentLeasesTable() {
  const [leaseToDelete, setLeaseToDelete] = useState<string | null>(null)
  const [leaseToEdit, setLeaseToEdit] = useState<any | null>(null)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: leases = [], isLoading } = useQuery({
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

      if (error) throw error
      return data
    },
  })

  const generatePaymentPeriods = useMutation({
    mutationFn: async (leaseId: string) => {
      const lease = leases.find(l => l.id === leaseId)
      if (!lease) throw new Error("Bail non trouvé")

      const { data: periods, error: periodsError } = await supabase.rpc('generate_lease_payment_periods', {
        p_lease_id: leaseId,
        p_start_date: lease.start_date,
        p_end_date: lease.end_date || null,
        p_rent_amount: lease.rent_amount,
        p_payment_frequency: lease.payment_frequency
      })

      if (periodsError) throw periodsError

      const { error: updateError } = await supabase
        .from('apartment_leases')
        .update({ status: 'active' })
        .eq('id', leaseId)

      if (updateError) throw updateError

      return periods
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Les périodes de paiement ont été générées et le bail est maintenant actif",
      })
      queryClient.invalidateQueries({ queryKey: ["apartment-leases"] })
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la génération des périodes",
        variant: "destructive",
      })
    }
  })

  const handleDelete = async () => {
    if (!leaseToDelete) return

    try {
      const { error: leaseError } = await supabase
        .from("apartment_leases")
        .delete()
        .eq("id", leaseToDelete)

      if (leaseError) throw leaseError

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

      queryClient.invalidateQueries({ queryKey: ["apartment-leases"] })
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
                  <LeaseStatus status={lease.status} />
                </TableCell>
                <TableCell>
                  <LeaseActions
                    lease={lease}
                    onEdit={setLeaseToEdit}
                    onDelete={setLeaseToDelete}
                    onGeneratePeriods={(id) => generatePaymentPeriods.mutate(id)}
                    isGenerating={generatePaymentPeriods.isPending}
                  />
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