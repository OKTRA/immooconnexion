import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface Expense {
  source_type: string
  source_id: string
  property_name: string
  amount: number
  description: string
  expense_date: string
}

interface ExpensesTabProps {
  expenses?: Expense[]
}

export function ExpensesTab({ expenses = [] }: ExpensesTabProps) {
  if (!expenses.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Aucune dépense enregistrée</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <Card key={`${expense.source_type}-${expense.source_id}-${expense.expense_date}`}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{expense.property_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(expense.expense_date), 'PPP', { locale: fr })}
                </p>
                <p className="text-sm mt-1">{expense.description}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-red-600">
                  -{expense.amount?.toLocaleString()} FCFA
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}