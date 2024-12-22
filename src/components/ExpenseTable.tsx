import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, FileText } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Link } from "react-router-dom"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface ExpenseTableProps {
  propertyId?: string;
}

export function ExpenseTable({ propertyId }: ExpenseTableProps) {
  const { toast } = useToast()

  const { data: payments = [], refetch } = useQuery({
    queryKey: ['payments', propertyId],
    queryFn: async () => {
      console.log("Fetching payments for property:", propertyId)
      const query = supabase
        .from('payment_history_with_tenant')
        .select('*')
      
      if (propertyId) {
        query.eq('property_id', propertyId)
      }
      
      const { data, error } = await query
      
      if (error) {
        console.error("Error fetching payments:", error)
        throw error
      }
      
      console.log("Payments data:", data)
      return data
    }
  })

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('contracts')
      .delete()
      .eq('id', id)

    if (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      })
      return
    }

    refetch()
    toast({
      title: "Paiement supprimé",
      description: "Le paiement a été supprimé avec succès",
    })
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bien</TableHead>
            <TableHead>Locataire</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date de début</TableHead>
            <TableHead>Date de fin</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.property_name}</TableCell>
              <TableCell>
                {payment.tenant_nom && payment.tenant_prenom 
                  ? `${payment.tenant_prenom} ${payment.tenant_nom}`
                  : 'Non renseigné'
                }
              </TableCell>
              <TableCell>{payment.montant} FCFA</TableCell>
              <TableCell>{payment.type}</TableCell>
              <TableCell>
                {format(new Date(payment.start_date), "PP", { locale: fr })}
              </TableCell>
              <TableCell>
                {payment.end_date 
                  ? format(new Date(payment.end_date), "PP", { locale: fr })
                  : "En cours"
                }
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Link to={`/locataires/${payment.tenant_id}/contrats`}>
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(payment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}