import {
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table"
import { ResponsiveTable } from "@/components/ui/responsive-table"
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
      
      // Get current user's profile
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      console.log("User ID:", user.id)

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle()

      console.log("User profile:", profile)

      // Build the query
      let query = supabase
        .from('expenses')
        .select('*')
      
      if (propertyId) {
        query = query.eq('property_id', propertyId)
      }
      
      // If not admin, only show agency's expenses
      if (profile?.role !== 'admin') {
        query = query.eq('agency_id', user.id)
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
      .from('expenses')
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
    <ResponsiveTable>
      <ResponsiveTable.Header>
        <TableRow>
          <TableHead>Montant</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </ResponsiveTable.Header>
      <ResponsiveTable.Body>
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
                {format(new Date(expense.date), "PP", { locale: fr })}
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
      </ResponsiveTable.Body>
    </ResponsiveTable>
  )
}
