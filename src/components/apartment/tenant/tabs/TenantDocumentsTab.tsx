import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

interface TenantDocumentsTabProps {
  tenant: any
}

export function TenantDocumentsTab({ tenant }: TenantDocumentsTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Documents du locataire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-32 flex flex-col items-center justify-center gap-2">
              <FileText className="h-8 w-8" />
              <span>Contrat de bail</span>
            </Button>
            
            <Button variant="outline" className="h-32 flex flex-col items-center justify-center gap-2">
              <FileText className="h-8 w-8" />
              <span>Pièce d'identité</span>
            </Button>
            
            <Button variant="outline" className="h-32 flex flex-col items-center justify-center gap-2">
              <FileText className="h-8 w-8" />
              <span>Dernier reçu</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}