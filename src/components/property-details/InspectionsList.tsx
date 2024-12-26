import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InspectionHistory } from "@/components/inspections/InspectionHistory"
import { ClipboardList } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface InspectionsListProps {
  contracts: any[]
}

export function InspectionsList({ contracts }: InspectionsListProps) {
  // Filter to only show caution contracts and take the latest one per tenant
  const cautionContractsByTenant = contracts
    .filter(contract => contract.type === 'caution')
    .reduce((acc, contract) => {
      // If we haven't seen this tenant yet, or if this contract is more recent
      if (!acc[contract.tenant_id] || 
          new Date(contract.created_at) > new Date(acc[contract.tenant_id].created_at)) {
        acc[contract.tenant_id] = contract;
      }
      return acc;
    }, {});

  const uniqueCautionContracts = Object.values(cautionContractsByTenant);

  if (uniqueCautionContracts.length === 0) {
    return null;
  }

  return (
    <>
      {uniqueCautionContracts.map((contract: any) => (
        <Card key={`inspections-${contract.id}`} className="bg-white dark:bg-gray-800">
          <CardHeader className="border-b dark:border-gray-700">
            <div className="flex items-center gap-3">
              <ClipboardList className="h-5 w-5 text-primary" />
              <CardTitle>
                Inspections - {contract.tenant_nom && contract.tenant_prenom 
                  ? `${contract.tenant_prenom} ${contract.tenant_nom}`
                  : 'Locataire non renseigné'
                }
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full whitespace-nowrap">
              <InspectionHistory contractId={contract.id} />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>
      ))}
    </>
  )
}