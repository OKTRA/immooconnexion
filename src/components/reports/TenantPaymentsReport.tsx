import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { useState } from "react"

interface Payment {
  id: number
  tenant: string
  property: string
  amount: number
  type: string
  date: string
  status: string
}

const tenantPayments = [
  {
    id: 1,
    tenant: "Awa MAIGA",
    property: "Appartement Jaune Block 1",
    amount: 155000,
    type: "Loyer",
    date: "2024-02-20",
    status: "Payé",
  },
  {
    id: 2,
    tenant: "Awa MAIGA",
    property: "Appartement Jaune Block 1",
    amount: 155000,
    type: "Loyer",
    date: "2024-03-20",
    status: "En retard",
  },
]

export function TenantPaymentsReport() {
  const [selectedTenant, setSelectedTenant] = useState<string>("")
  
  const handlePrint = () => {
    window.print()
  }

  const filteredPayments = selectedTenant 
    ? tenantPayments.filter(payment => payment.tenant === selectedTenant)
    : tenantPayments

  const uniqueTenants = Array.from(new Set(tenantPayments.map(p => p.tenant)))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Historique des Paiements</CardTitle>
        <div className="flex gap-4">
          <Select value={selectedTenant} onValueChange={setSelectedTenant}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Sélectionner un locataire" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les locataires</SelectItem>
              {uniqueTenants.map(tenant => (
                <SelectItem key={tenant} value={tenant}>{tenant}</SelectItem>
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
        <div className="rounded-md border">
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
                  <td className="p-4">{payment.tenant}</td>
                  <td className="p-4">{payment.property}</td>
                  <td className="p-4">{payment.amount} FCFA</td>
                  <td className="p-4">{payment.type}</td>
                  <td className="p-4">{payment.date}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      payment.status === 'Payé' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}