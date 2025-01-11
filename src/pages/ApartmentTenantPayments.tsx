import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"

export default function ApartmentTenantPayments() {
  const { tenantId } = useParams()

  const { data: payments, isLoading } = useQuery({
    queryKey: ['apartment-tenant-payments', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apartment_lease_payments')
        .select(`
          *,
          apartment_leases (
            tenant_id,
            unit_id,
            apartment_units (
              unit_number,
              apartment_id,
              apartments (
                name
              )
            )
          )
        `)
        .eq('apartment_leases.tenant_id', tenantId)
      
      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Historique des paiements</h1>
      
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Montant</th>
              <th className="p-4 text-left">Statut</th>
              <th className="p-4 text-left">Appartement</th>
              <th className="p-4 text-left">Unité</th>
            </tr>
          </thead>
          <tbody>
            {payments?.map((payment) => (
              <tr key={payment.id} className="border-b">
                <td className="p-4">
                  {new Date(payment.due_date).toLocaleDateString()}
                </td>
                <td className="p-4">
                  {payment.amount.toLocaleString()} FCFA
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    payment.status === 'paid' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payment.status === 'paid' ? 'Payé' : 'En attente'}
                  </span>
                </td>
                <td className="p-4">
                  {payment.apartment_leases?.apartment_units?.apartments?.name}
                </td>
                <td className="p-4">
                  {payment.apartment_leases?.apartment_units?.unit_number}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}