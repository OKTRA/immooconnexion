import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Loader2, DollarSign, Calendar, CheckSquare } from "lucide-react"

export function PropertySalesTable() {
  const { data: sales = [], isLoading } = useQuery({
    queryKey: ['property-sales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_sales')
        .select(`
          *,
          property:properties(bien)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bien</TableHead>
            <TableHead>Acheteur</TableHead>
            <TableHead>Prix de vente</TableHead>
            <TableHead>Date de vente</TableHead>
            <TableHead>Commission</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>{sale.property.bien}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{sale.buyer_name}</p>
                  <p className="text-sm text-gray-500">{sale.buyer_contact}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  {sale.sale_price.toLocaleString()} FCFA
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(sale.sale_date), 'Pp', { locale: fr })}
                </div>
              </TableCell>
              <TableCell>
                {sale.commission_amount?.toLocaleString() || '0'} FCFA
              </TableCell>
              <TableCell>
                <Badge variant={sale.payment_status === 'completed' ? 'success' : 'warning'}>
                  {sale.payment_status === 'completed' ? (
                    <div className="flex items-center gap-1">
                      <CheckSquare className="h-3 w-3" />
                      Payé
                    </div>
                  ) : (
                    'En attente'
                  )}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
          {sales.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                Aucune vente enregistrée
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  )
}