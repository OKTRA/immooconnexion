import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InspectionHistory } from "@/components/inspections/InspectionHistory"

interface InspectionsListProps {
  contracts: any[]
}

export function InspectionsList({ contracts }: InspectionsListProps) {
  return (
    <>
      {contracts?.map((contract: any) => (
        <Card key={`inspections-${contract.id}`}>
          <CardHeader>
            <CardTitle>
              Inspections - {contract.tenant_nom && contract.tenant_prenom 
                ? `${contract.tenant_prenom} ${contract.tenant_nom}`
                : 'Locataire non renseigné'
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InspectionHistory contractId={contract.id} />
          </CardContent>
        </Card>
      ))}
    </>
  )
}