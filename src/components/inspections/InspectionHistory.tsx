import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { TenantReceipt } from "@/components/tenants/TenantReceipt"

interface InspectionHistoryProps {
  contractId: string
}

export function InspectionHistory({ contractId }: InspectionHistoryProps) {
  const { data: inspections } = useQuery({
    queryKey: ["inspections", contractId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("property_inspections")
        .select(`
          *,
          contracts (
            tenant:tenants (
              first_name,
              last_name,
              phone_number,
              agency_fees,
              profession
            )
          )
        `)
        .eq("contract_id", contractId)
        .order("inspection_date", { ascending: false })

      if (error) throw error
      return data
    }
  })

  if (!inspections?.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Aucune inspection enregistrée
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {inspections.map((inspection) => (
        <Card key={inspection.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">
                Inspection du{" "}
                {format(new Date(inspection.inspection_date), "d MMMM yyyy", {
                  locale: fr,
                })}
              </CardTitle>
              <Badge
                variant={
                  inspection.status === "completed" ? "default" : "secondary"
                }
              >
                {inspection.status === "completed"
                  ? "Terminée"
                  : "En cours"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">État des lieux</h4>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Dégâts constatés:</span>{" "}
                    {inspection.has_damages ? "Oui" : "Non"}
                  </p>
                  {inspection.has_damages && (
                    <>
                      <p>
                        <span className="font-medium">Description:</span>{" "}
                        {inspection.damage_description}
                      </p>
                      <p>
                        <span className="font-medium">
                          Coût des réparations:
                        </span>{" "}
                        {inspection.repair_costs.toLocaleString()} FCFA
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Caution</h4>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Montant remboursé:</span>{" "}
                    {inspection.deposit_returned.toLocaleString()} FCFA
                  </p>
                </div>
              </div>
            </div>

            {inspection.photo_urls?.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Photos</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {inspection.photo_urls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Photo d'inspection ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            )}

            {inspection.status === "completed" && (
              <div className="mt-4">
                <TenantReceipt
                  tenant={{
                    first_name: inspection.contracts?.tenant?.first_name,
                    last_name: inspection.contracts?.tenant?.last_name,
                    phone_number: inspection.contracts?.tenant?.phone_number,
                    agency_fees: inspection.contracts?.tenant?.agency_fees,
                    profession: inspection.contracts?.tenant?.profession
                  }}
                  contractId={contractId}
                  isEndReceipt={true}
                  inspection={{
                    has_damages: inspection.has_damages,
                    damage_description: inspection.damage_description || undefined,
                    repair_costs: inspection.repair_costs,
                    deposit_returned: inspection.deposit_returned
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}