import { TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash, Eye } from "lucide-react"
import { useState } from "react"
import { PropertyOwnerDialog } from "./PropertyOwnerDialog"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useQueryClient } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

interface PropertyOwnerRowProps {
  owner: {
    id: string
    first_name: string
    last_name: string
    email: string | null
    phone_number: string | null
    status: 'active' | 'inactive'
  }
}

export function PropertyOwnerRow({ owner }: PropertyOwnerRowProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // Fetch payment statuses for this owner
  const { data: paymentStatus } = useQuery({
    queryKey: ['owner-payments', owner.id],
    queryFn: async () => {
      // Fetch pending payments
      const { data: pendingPayments, error: pendingError } = await supabase
        .from('apartment_lease_payments')
        .select(`
          *,
          apartment_leases!inner(
            apartment_units!inner(
              apartments!inner(
                owner_id
              )
            )
          )
        `)
        .eq('status', 'pending')
        .eq('apartment_leases.apartment_units.apartments.owner_id', owner.id);

      if (pendingError) throw pendingError;

      // Fetch late payments
      const { data: latePayments, error: lateError } = await supabase
        .from('apartment_lease_payments')
        .select(`
          *,
          late_payment_fees!inner(*),
          apartment_leases!inner(
            apartment_units!inner(
              apartments!inner(
                owner_id
              )
            )
          )
        `)
        .eq('apartment_leases.apartment_units.apartments.owner_id', owner.id)
        .not('late_payment_fees', 'is', null);

      if (lateError) throw lateError;

      return {
        pendingCount: pendingPayments?.length || 0,
        lateCount: latePayments?.length || 0,
        totalPendingAmount: pendingPayments?.reduce((sum, payment) => sum + payment.amount, 0) || 0,
        totalLateAmount: latePayments?.reduce((sum, payment) => sum + payment.amount, 0) || 0,
      };
    }
  });

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('property_owners')
        .delete()
        .eq('id', owner.id)

      if (error) throw error

      toast({
        title: "Propriétaire supprimé",
        description: "Le propriétaire a été supprimé avec succès"
      })

      queryClient.invalidateQueries({ queryKey: ['property-owners'] })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive"
      })
    }
  }

  const handleViewDetails = () => {
    navigate(`/agence/property-owners/${owner.id}`)
  }

  return (
    <>
      <TableRow>
        <TableCell>{owner.first_name} {owner.last_name}</TableCell>
        <TableCell>{owner.email || '-'}</TableCell>
        <TableCell>{owner.phone_number || '-'}</TableCell>
        <TableCell>
          <Badge variant={owner.status === 'active' ? 'default' : 'secondary'}>
            {owner.status === 'active' ? 'Actif' : 'Inactif'}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex flex-col gap-1">
            {paymentStatus?.pendingCount > 0 && (
              <Badge variant="warning" className="w-fit">
                {paymentStatus.pendingCount} paiements en attente
                ({paymentStatus.totalPendingAmount.toLocaleString()} FCFA)
              </Badge>
            )}
            {paymentStatus?.lateCount > 0 && (
              <Badge variant="destructive" className="w-fit">
                {paymentStatus.lateCount} paiements en retard
                ({paymentStatus.totalLateAmount.toLocaleString()} FCFA)
              </Badge>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleViewDetails}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditDialogOpen(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      <PropertyOwnerDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        owner={owner}
      />
    </>
  )
}