import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Printer } from "lucide-react"
import { Link } from "react-router-dom"
import { PaymentDialog } from "@/components/payment/PaymentDialog"
import { InspectionDialog } from "@/components/inspections/InspectionDialog"
import { ScrollArea } from "@/components/ui/scroll-area"

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
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-xl md:text-2xl">Historique des paiements</CardTitle>
          <PaymentDialog propertyId={propertyId} />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full overflow-auto">
          <div className="rounded-md border min-w-[800px] md:min-w-0">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left text-sm md:text-base">Date</th>
                  <th className="p-2 text-left text-sm md:text-base">Locataire</th>
                  <th className="p-2 text-left text-sm md:text-base">Montant</th>
                  <th className="p-2 text-left text-sm md:text-base">Type</th>
                  <th className="p-2 text-left text-sm md:text-base">Statut</th>
                  <th className="p-2 text-left text-sm md:text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contracts?.map((contract: any) => (
                  <tr key={contract.id} className="border-b">
                    <td className="p-2 text-sm md:text-base">{new Date(contract.created_at).toLocaleDateString()}</td>
                    <td className="p-2 text-sm md:text-base">
                      {contract.tenant_nom && contract.tenant_prenom 
                        ? `${contract.tenant_prenom} ${contract.tenant_nom}`
                        : 'Non renseigné'
                      }
                    </td>
                    <td className="p-2 text-sm md:text-base">{contract.montant?.toLocaleString()} FCFA</td>
                    <td className="p-2 capitalize text-sm md:text-base">{contract.type}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs md:text-sm ${
                        contract.statut === 'payé' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {contract.statut}
                      </span>
                    </td>
                    <td className="p-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {contract.tenant_id && (
                          <>
                            <Link to={`/locataires/${contract.tenant_id}/contrats`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 md:h-9 md:w-9"
                              onClick={() => onPrintReceipt(contract)}
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 md:h-9 md:w-9"
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
                    <td colSpan={6} className="p-4 text-center text-muted-foreground text-sm md:text-base">
                      Aucun paiement enregistré
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}