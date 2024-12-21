import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const expenses = [
  {
    id: 1,
    property: "Appartement Jaune Block 1",
    amount: 25000,
    type: "Maintenance",
    date: "2024-02-20",
    description: "Réparation plomberie",
  },
  {
    id: 2,
    property: "Maison M201",
    amount: 15000,
    type: "Charges",
    date: "2024-02-18",
    description: "Électricité février",
  },
]

export function ExpenseTable() {
  const { toast } = useToast()

  const handleDelete = (id: number) => {
    toast({
      title: "Dépense supprimée",
      description: "La dépense a été supprimée avec succès",
    })
  }

  const handleEdit = (id: number) => {
    toast({
      title: "Modification",
      description: "Fonctionnalité à venir",
    })
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bien</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{expense.property}</TableCell>
              <TableCell>{expense.amount} FCFA</TableCell>
              <TableCell>{expense.type}</TableCell>
              <TableCell>{expense.date}</TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(expense.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(expense.id)}
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