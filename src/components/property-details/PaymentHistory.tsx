import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Printer } from "lucide-react"
import { Link } from "react-router-dom"
import { PaymentDialog } from "@/components/payment/PaymentDialog"
import { InspectionDialog } from "@/components/inspections/InspectionDialog"

interface PaymentHistoryProps {
  propertyId: string
  contracts: any[]
  onPrintReceipt: (contract: any) => void
  onPrintContract: (contract: any) => void
}

export function PaymentHistory({ 
  propertyId, 
  contracts, 
  onPrintReceipt, 
  onPrintContract 
}: PaymentHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Historique des paiements</CardTitle>
          <PaymentDialog propertyId={propertyId} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Locataire</th>
                <th className="p-2 text-left">Montant</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Statut</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contracts?.map((contract: any) => (
                <tr key={contract.id} className="border-b">
                  <td className="p-2">{new Date(contract.created_at).toLocaleDateString()}</td>
                  <td className="p-2">
                    {contract.tenant_nom && contract.tenant_prenom 
                      ? `${contract.tenant_prenom} ${contract.tenant_nom}`
                      : 'Non renseigné'
                    }
                  </td>
                  <td className="p-2">{contract.montant?.toLocaleString()} FCFA</td>
                  <td className="p-2 capitalize">{contract.type}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      contract.statut === 'payé' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {contract.statut}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      {contract.tenant_id && (
                        <>
                          <Link to={`/locataires/${contract.tenant_id}/contrats`}>
                            <Button variant="ghost" size="icon">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => onPrintReceipt(contract)}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => onPrintContract(contract)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <InspectionDialog contract={contract} />
                    </div>
                  </td>
                </tr>
              ))}
              {(!contracts || contracts.length === 0) && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-muted-foreground">
                    Aucun paiement enregistré
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