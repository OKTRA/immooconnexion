import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Loader2 } from "lucide-react"

export default function PropertyOwnerDetails() {
  const { ownerId } = useParams()

  const { data: owner, isLoading: ownerLoading } = useQuery({
    queryKey: ['property-owner', ownerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_owners')
        .select('*')
        .eq('id', ownerId)
        .single()

      if (error) throw error
      return data
    }
  })

  const { data: revenues, isLoading: revenuesLoading } = useQuery({
    queryKey: ['owner-revenues', ownerId],
    queryFn: async () => {
      const { data: propertyRevenues, error: propertyError } = await supabase
        .from('owner_property_revenues')
        .select('*')
        .eq('owner_id', ownerId)
        .order('payment_date', { ascending: false })

      const { data: apartmentRevenues, error: apartmentError } = await supabase
        .from('owner_apartment_revenues')
        .select('*')
        .eq('owner_id', ownerId)
        .order('payment_date', { ascending: false })

      if (propertyError || apartmentError) throw propertyError || apartmentError
      return [...(propertyRevenues || []), ...(apartmentRevenues || [])]
    }
  })

  const { data: expenses } = useQuery({
    queryKey: ['owner-expenses', ownerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('owner_expenses_view')
        .select('*')
        .eq('owner_id', ownerId)
        .order('expense_date', { ascending: false })

      if (error) throw error
      return data
    }
  })

  const { data: statements } = useQuery({
    queryKey: ['owner-statements', ownerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('owner_statements')
        .select('*')
        .eq('owner_id', ownerId)
        .order('period_end', { ascending: false })

      if (error) throw error
      return data
    }
  })

  if (ownerLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!owner) {
    return <div>Propriétaire non trouvé</div>
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {owner.first_name} {owner.last_name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{owner.email || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Téléphone</p>
              <p className="text-sm text-muted-foreground">{owner.phone_number || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="revenues">
        <TabsList>
          <TabsTrigger value="revenues">Revenus</TabsTrigger>
          <TabsTrigger value="expenses">Dépenses</TabsTrigger>
          <TabsTrigger value="statements">États financiers</TabsTrigger>
        </TabsList>

        <TabsContent value="revenues" className="space-y-4">
          {revenuesLoading ? (
            <Card>
              <CardContent className="p-6">
                <Loader2 className="h-6 w-6 animate-spin" />
              </CardContent>
            </Card>
          ) : revenues?.length ? (
            revenues.map((revenue) => (
              <Card key={`${revenue.source_type}-${revenue.source_id}-${revenue.payment_date}`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">
                        {revenue.source_type === 'property' ? 'Propriété' : 'Appartement'}: {revenue.property_name || revenue.apartment_name}
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
            ))
          ) : (
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Aucun revenu enregistré</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          {expenses?.length ? (
            expenses.map((expense) => (
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
            ))
          ) : (
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Aucune dépense enregistrée</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="statements" className="space-y-4">
          {statements?.length ? (
            statements.map((statement) => (
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
            ))
          ) : (
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Aucun état financier disponible</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}