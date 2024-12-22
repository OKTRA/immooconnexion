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
import { useParams } from "react-router-dom"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export function TenantContracts() {
  const { id } = useParams()

  const { data: contracts = [] } = useQuery({
    queryKey: ["tenant-contracts", id],
    queryFn: async () => {
      console.log("Fetching contracts for tenant:", id)

      const { data: contractsData, error } = await supabase
        .from("contracts")
        .select(`
          *,
          property:properties(*)
        `)
        .eq("tenant_id", id)

      if (error) {
        console.error("Error fetching contracts:", error)
        throw error
      }

      console.log("Contracts data:", contractsData)
      return contractsData
    },
  })

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bien</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Date de début</TableHead>
              <TableHead>Date de fin</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell className="font-medium">
                  {contract.property?.bien || "Non renseigné"}
                </TableCell>
                <TableCell>{contract.type || "Non renseigné"}</TableCell>
                <TableCell>
                  {contract.montant
                    ? new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "XOF",
                      }).format(contract.montant)
                    : "Non renseigné"}
                </TableCell>
                <TableCell>
                  {contract.start_date
                    ? format(new Date(contract.start_date), "PP", { locale: fr })
                    : "Non renseigné"}
                </TableCell>
                <TableCell>
                  {contract.end_date
                    ? format(new Date(contract.end_date), "PP", { locale: fr })
                    : "En cours"}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      contract.statut === "actif"
                        ? "bg-green-50 text-green-700"
                        : contract.statut === "terminé"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {contract.statut || "En attente"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
            {contracts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Aucun contrat trouvé pour ce locataire
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}