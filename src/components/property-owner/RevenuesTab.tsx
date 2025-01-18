import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

type PropertyRevenue = {
  amount: number
  commission_amount: number
  commission_rate: number
  first_name: string
  last_name: string
  net_amount: number
  owner_id: string
  payment_date: string
  payment_type: string
  property_id: string
  property_name: string
  source_type: 'property'
}

type ApartmentRevenue = {
  amount: number
  commission_amount: number
  commission_rate: number
  first_name: string
  last_name: string
  net_amount: number
  owner_id: string
  payment_date: string
  payment_type: string
  apartment_id: string
  apartment_name: string
  source_type: 'apartment'
}

type Revenue = PropertyRevenue | ApartmentRevenue

interface RevenuesTabProps {
  revenues?: Revenue[]
  isLoading: boolean
}

export function RevenuesTab({ revenues = [], isLoading }: RevenuesTabProps) {
  const getSourceName = (revenue: Revenue) => {
    if (revenue.source_type === 'property') {
      return `Propriété: ${revenue.property_name}`
    } else {
      return `Appartement: ${revenue.apartment_name}`
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (!revenues.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Aucun revenu enregistré</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {revenues.map((revenue) => (
        <Card key={`${revenue.source_type}-${revenue.payment_date}`}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">
                  {getSourceName(revenue)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(revenue.payment_date), 'PPP', { locale: fr })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{revenue.amount?.toLocaleString()} FCFA</p>
                <p className="text-sm text-muted-foreground">
                  Commission: {revenue.commission_amount?.toLocaleString()} FCFA
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}