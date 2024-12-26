import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PropertySaleDialog } from "./PropertySaleDialog"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"

interface PropertySalesSectionProps {
  propertyId: string
}

export function PropertySalesSection({ propertyId }: PropertySalesSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ['property-sales', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_sales')
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ventes</CardTitle>
        <Button onClick={() => setIsDialogOpen(true)}>
          Enregistrer une vente
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sales.map((sale) => (
            <div key={sale.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Acheteur: {sale.buyer_name}</h3>
                  <p className="text-sm text-gray-500">
                    Contact: {sale.buyer_contact || 'Non spécifié'}
                  </p>
                </div>
                <Badge variant={sale.payment_status === 'completed' ? 'success' : 'warning'}>
                  {sale.payment_status === 'completed' ? 'Payé' : 'En attente'}
                </Badge>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Prix de vente</p>
                  <p className="font-semibold">
                    {sale.sale_price.toLocaleString()} FCFA
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Commission</p>
                  <p className="font-semibold">
                    {sale.commission_amount?.toLocaleString() || '0'} FCFA
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date de vente</p>
                  <p className="font-semibold">
                    {format(new Date(sale.sale_date), 'Pp', { locale: fr })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {sales.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune vente enregistrée
            </div>
          )}
        </div>
      </CardContent>
      <PropertySaleDialog
        propertyId={propertyId}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </Card>
  )
}