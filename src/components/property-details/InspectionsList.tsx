import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface InspectionsListProps {
  contractId: string
}

export function InspectionsList({ contractId }: InspectionsListProps) {
  const { data: inspections = [] } = useQuery({
    queryKey: ["property-inspections", contractId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("property_inspections")
        .select(`
          *,
          contracts (
            tenant_id,
            tenants (
              nom,
              prenom,
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
    },
    enabled: !!contractId
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inspections</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Dégâts</th>
                <th className="p-4 text-left">Coûts</th>
                <th className="p-4 text-left">Statut</th>
              </tr>
            </thead>
            <tbody>
              {inspections?.map((inspection) => (
                <tr key={inspection.id} className="border-b">
                  <td className="p-4">
                    {format(new Date(inspection.inspection_date), 'PP', { locale: fr })}
                  </td>
                  <td className="p-4">
                    <Badge variant={inspection.has_damages ? 'destructive' : 'default'}>
                      {inspection.has_damages ? 'Oui' : 'Non'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    {inspection.repair_costs?.toLocaleString()} FCFA
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={inspection.status === 'completed' ? 'default' : 'secondary'}
                    >
                      {inspection.status === 'completed' ? 'Terminée' : 'En cours'}
                    </Badge>
                  </td>
                </tr>
              ))}
              {(!inspections || inspections.length === 0) && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-muted-foreground">
                    Aucune inspection enregistrée
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