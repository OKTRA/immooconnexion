import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface InspectionHistoryProps {
  contractId: string
}

export function InspectionHistory({ contractId }: InspectionHistoryProps) {
  const { data: inspections = [] } = useQuery({
    queryKey: ['inspections', contractId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_inspections')
        .select('*')
        .eq('contract_id', contractId)
        .order('inspection_date', { ascending: false })

      if (error) throw error
      return data
    }
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date d'inspection</TableHead>
            <TableHead>État</TableHead>
            <TableHead>Dégâts</TableHead>
            <TableHead>Coûts réparation</TableHead>
            <TableHead>Caution retournée</TableHead>
            <TableHead>Photos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inspections.map((inspection) => (
            <TableRow key={inspection.id}>
              <TableCell>
                {format(new Date(inspection.inspection_date), 'PP', { locale: fr })}
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  inspection.status === 'completé' 
                    ? 'bg-green-50 text-green-700'
                    : 'bg-yellow-50 text-yellow-700'
                }`}>
                  {inspection.status}
                </span>
              </TableCell>
              <TableCell>
                {inspection.has_damages ? (
                  <span className="text-red-600">Oui</span>
                ) : (
                  <span className="text-green-600">Non</span>
                )}
              </TableCell>
              <TableCell>
                {inspection.repair_costs?.toLocaleString()} FCFA
              </TableCell>
              <TableCell>
                {inspection.deposit_returned?.toLocaleString()} FCFA
              </TableCell>
              <TableCell>
                {inspection.photo_urls && inspection.photo_urls.length > 0 && (
                  <div className="flex gap-2">
                    {inspection.photo_urls.map((url: string, index: number) => (
                      <img
                        key={index}
                        src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/inspection_photos/${url}`}
                        alt={`Photo d'inspection ${index + 1}`}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
          {inspections.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                Aucune inspection enregistrée
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}