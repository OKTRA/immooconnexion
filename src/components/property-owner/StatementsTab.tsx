import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface Statement {
  id: string
  period_start: string
  period_end: string
  total_revenue: number
  total_expenses: number
  total_commission: number
  net_amount: number
}

interface StatementsTabProps {
  statements?: Statement[]
}

export function StatementsTab({ statements = [] }: StatementsTabProps) {
  if (!statements.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Aucun état financier disponible</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {statements.map((statement) => (
        <Card key={statement.id}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">
                  État financier - {format(new Date(statement.period_start), 'MMMM yyyy', { locale: fr })}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Du {format(new Date(statement.period_start), 'PP', { locale: fr })} au{' '}
                  {format(new Date(statement.period_end), 'PP', { locale: fr })}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="font-medium">
                  Net: {statement.net_amount?.toLocaleString()} FCFA
                </p>
                <p className="text-sm text-muted-foreground">
                  Revenus: {statement.total_revenue?.toLocaleString()} FCFA
                </p>
                <p className="text-sm text-muted-foreground">
                  Dépenses: {statement.total_expenses?.toLocaleString()} FCFA
                </p>
                <p className="text-sm text-muted-foreground">
                  Commission: {statement.total_commission?.toLocaleString()} FCFA
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}