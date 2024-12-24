import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import type { PaymentHistory } from "@/integrations/supabase/types/payment-history"

export function TenantPaymentsReport() {
  const [selectedTenant, setSelectedTenant] = useState<string>("all")
  
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['tenant-payments'],
    queryFn: async () => {
      console.log('Fetching tenant payments')
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      const { data, error } = await supabase
        .from('payment_history_with_tenant')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching payments:', error)
        throw error
      }

      return (data || []) as PaymentHistory[]
    }
  })

  const handlePrint = () => {
    const style = document.createElement('style')
    style.textContent = `
      @page {
        size: portrait;
        margin: 2cm;
      }
      @media print {
        body {
          padding: 0;
          margin: 0;
        }
        .print-content {
          width: 100%;
          margin: 0;
          padding: 20px;
        }
      }
    `
    document.head.appendChild(style)
    window.print()
    document.head.removeChild(style)
  }

  const filteredPayments = selectedTenant === "all"
    ? payments
    : payments.filter(payment => payment.tenant_id === selectedTenant)

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <Card className="print:shadow-none print:border-none">
      <CardHeader className="flex flex-row items-center justify-between print:hidden">
        <CardTitle>Historique des Paiements</CardTitle>
        <div className="flex gap-4">
          <Select value={selectedTenant} onValueChange={setSelectedTenant}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Sélectionner un locataire" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les locataires</SelectItem>
              {payments.map(tenant => (
                <SelectItem key={tenant.id} value={tenant.id}>
                  {tenant.prenom} {tenant.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border print:border-none print-content">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left">Locataire</th>
                <th className="p-4 text-left">Bien</th>
                <th className="p-4 text-left">Montant</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-b">
                  <td className="p-4">
                    {payment.tenant_nom && payment.tenant_prenom 
                      ? `${payment.tenant_prenom} ${payment.tenant_nom}`
                      : 'Non renseigné'
                    }
                  </td>
                  <td className="p-4">{payment.property_name || 'Non renseigné'}</td>
                  <td className="p-4">{payment.montant?.toLocaleString()} FCFA</td>
                  <td className="p-4 capitalize">{payment.type || 'Non renseigné'}</td>
                  <td className="p-4">
                    {payment.created_at 
                      ? new Date(payment.created_at).toLocaleDateString()
                      : 'Non renseigné'
                    }
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      payment.statut === 'payé' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {payment.statut || 'En attente'}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted-foreground">
                    Aucun paiement trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
