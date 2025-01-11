import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"

export default function ApartmentTenantLeases() {
  const { tenantId } = useParams()

  const { data: leases, isLoading } = useQuery({
    queryKey: ['apartment-tenant-leases', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apartment_leases')
        .select(`
          *,
          apartment_units (
            unit_number,
            apartment_id,
            apartments (
              name
            )
          )
        `)
        .eq('tenant_id', tenantId)
      
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
      <h1 className="text-2xl font-bold mb-6">Contrats de location</h1>
      
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-4 text-left">Début</th>
              <th className="p-4 text-left">Fin</th>
              <th className="p-4 text-left">Loyer</th>
              <th className="p-4 text-left">Caution</th>
              <th className="p-4 text-left">Statut</th>
              <th className="p-4 text-left">Appartement</th>
              <th className="p-4 text-left">Unité</th>
            </tr>
          </thead>
          <tbody>
            {leases?.map((lease) => (
              <tr key={lease.id} className="border-b">
                <td className="p-4">
                  {new Date(lease.start_date).toLocaleDateString()}
                </td>
                <td className="p-4">
                  {lease.end_date ? new Date(lease.end_date).toLocaleDateString() : '-'}
                </td>
                <td className="p-4">
                  {lease.rent_amount.toLocaleString()} FCFA
                </td>
                <td className="p-4">
                  {lease.deposit_amount?.toLocaleString()} FCFA
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    lease.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {lease.status === 'active' ? 'Actif' : 'Terminé'}
                  </span>
                </td>
                <td className="p-4">
                  {lease.apartment_units?.apartments?.name}
                </td>
                <td className="p-4">
                  {lease.apartment_units?.unit_number}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}