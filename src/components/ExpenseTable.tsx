import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface ExpenseTableProps {
  propertyId?: string;
}

export function ExpenseTable({ propertyId }: ExpenseTableProps) {
  const { toast } = useToast()

  const { data: expenses = [], refetch } = useQuery({
    queryKey: ['expenses', propertyId],
    queryFn: async () => {
      console.log("Fetching expenses for property:", propertyId)
      const query = supabase
        .from('contracts')
        .select('*')
        .eq('type', 'depense')
      
      if (propertyId) {
        query.eq('property_id', propertyId)
      }
      
      const { data, error } = await query
      
      if (error) {
        console.error("Error fetching expenses:", error)
        throw error
      }
      
      console.log("Expenses data:", data)
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
      title: "Dépense supprimée",
      description: "La dépense a été supprimée avec succès",
    })
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Montant</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                Aucune dépense enregistrée
              </TableCell>
            </TableRow>
          ) : (
            expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{Math.abs(expense.montant)} FCFA</TableCell>
                <TableCell>{expense.description || 'N/A'}</TableCell>
                <TableCell>
                  {format(new Date(expense.start_date), "PP", { locale: fr })}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(expense.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}