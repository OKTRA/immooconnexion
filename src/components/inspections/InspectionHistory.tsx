import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useState } from "react"
import { TenantReceipt } from "@/components/tenants/TenantReceipt"
import { Loader2 } from "lucide-react"

interface InspectionHistoryProps {
  contractId: string
}

export function InspectionHistory({ contractId }: InspectionHistoryProps) {
  const [showReceipt, setShowReceipt] = useState(false)
  const [selectedInspection, setSelectedInspection] = useState<any>(null)

  const { data: inspections, isLoading } = useQuery({
    queryKey: ['inspections', contractId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_inspections')
        .select(`
          *,
          contracts (
            tenant:tenants (
              id,
              first_name,
              last_name,
              phone_number,
              agency_fees,
              profession
            )
          )
        `)
        .eq('contract_id', contractId)
        .order('inspection_date', { ascending: false })

      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!inspections || inspections.length === 0) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-center text-muted-foreground">
            Aucune inspection trouvée
          </p>
        </CardContent>
      </Card>
    )
  }

  const handleShowReceipt = (inspection: any) => {
    setSelectedInspection(inspection)
    setShowReceipt(true)
  }

  return (
    <div className="space-y-4">
      {inspections.map((inspection) => (
        <Card key={inspection.id} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => handleShowReceipt(inspection)}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">
                Inspection du {format(new Date(inspection.inspection_date), 'PP', { locale: fr })}
              </CardTitle>
              <Badge variant={inspection.status === 'completed' ? 'default' : 'secondary'}>
                {inspection.status === 'completed' ? 'Terminée' : 'En cours'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Dégâts constatés:</span> {inspection.has_damages ? 'Oui' : 'Non'}
              </p>
              {inspection.has_damages && (
                <>
                  <p>
                    <span className="font-medium">Description:</span> {inspection.damage_description}
                  </p>
                  <p>
                    <span className="font-medium">Coût des réparations:</span> {inspection.repair_costs.toLocaleString()} FCFA
                  </p>
                </>
              )}
              <p>
                <span className="font-medium">Caution remboursée:</span> {inspection.deposit_returned.toLocaleString()} FCFA
              </p>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-3xl">
          {selectedInspection && selectedInspection.contracts?.tenant && (
            <TenantReceipt
              tenant={{
                first_name: selectedInspection.contracts.tenant.first_name,
                last_name: selectedInspection.contracts.tenant.last_name,
                phone_number: selectedInspection.contracts.tenant.phone_number,
                agency_fees: selectedInspection.contracts.tenant.agency_fees,
                profession: selectedInspection.contracts.tenant.profession
              }}
              isEndReceipt={true}
              inspection={{
                has_damages: selectedInspection.has_damages,
                damage_description: selectedInspection.damage_description,
                repair_costs: selectedInspection.repair_costs,
                deposit_returned: selectedInspection.deposit_returned
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}