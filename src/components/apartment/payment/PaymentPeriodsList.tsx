import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface PaymentPeriodsListProps {
  leaseId: string
}

export function PaymentPeriodsList({ leaseId }: PaymentPeriodsListProps) {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['lease-payments', leaseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apartment_lease_payments')
        .select('*')
        .eq('lease_id', leaseId)
        .order('payment_period_start', { ascending: true })

      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <ScrollArea className="h-[300px] rounded-md border p-4">
      <div className="space-y-4">
        {payments?.map((payment) => (
          <Card key={payment.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {format(new Date(payment.payment_period_start), 'dd MMMM yyyy', { locale: fr })}
                    {payment.payment_period_end && (
                      <> - {format(new Date(payment.payment_period_end), 'dd MMMM yyyy', { locale: fr })}</>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    Montant: {payment.amount.toLocaleString()} FCFA
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-sm ${
                  payment.status === 'paid' 
                    ? 'bg-green-100 text-green-800'
                    : payment.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {payment.status === 'paid' ? 'Payé' : payment.status === 'pending' ? 'En attente' : 'En retard'}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}