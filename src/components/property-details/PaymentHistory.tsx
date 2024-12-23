import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Printer, Ban } from "lucide-react"
import { Link } from "react-router-dom"
import { PaymentDialog } from "@/components/payment/PaymentDialog"
import { InspectionDialog } from "@/components/inspections/InspectionDialog"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

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
    <Card className="w-full bg-white dark:bg-gray-800">
      <CardHeader className="border-b dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-xl md:text-2xl">Historique des paiements</CardTitle>
          <PaymentDialog propertyId={propertyId} />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="rounded-lg border dark:border-gray-700">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <th className="p-3 text-left text-sm md:text-base font-medium">Date</th>
                  <th className="p-3 text-left text-sm md:text-base font-medium">Locataire</th>
                  <th className="p-3 text-left text-sm md:text-base font-medium">Montant</th>
                  <th className="p-3 text-left text-sm md:text-base font-medium">Type</th>
                  <th className="p-3 text-left text-sm md:text-base font-medium">Statut</th>
                  <th className="p-3 text-left text-sm md:text-base font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contracts?.map((contract: any) => (
                  <tr key={contract.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <td className="p-3 text-sm md:text-base">
                      {format(new Date(contract.created_at), 'PP', { locale: fr })}
                    </td>
                    <td className="p-3 text-sm md:text-base">
                      {contract.tenant_nom && contract.tenant_prenom 
                        ? `${contract.tenant_prenom} ${contract.tenant_nom}`
                        : 'Non renseigné'
                      }
                    </td>
                    <td className="p-3 text-sm md:text-base font-medium">
                      {contract.montant?.toLocaleString()} FCFA
                    </td>
                    <td className="p-3 capitalize text-sm md:text-base">{contract.type}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs md:text-sm ${
                        contract.statut === 'payé' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {contract.statut}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {contract.tenant_id ? (
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
                            <InspectionDialog contract={contract} className="inline-flex" />
                          </>
                        ) : (
                          <Ban className="h-4 w-4 text-muted-foreground" />
                        )}
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
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}