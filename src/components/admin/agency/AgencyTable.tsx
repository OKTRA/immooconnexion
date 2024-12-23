import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AgencyTableRow } from "./AgencyTableRow"
import { Agency } from "./types"

interface AgencyTableProps {
  agencies: Agency[]
  onEdit: (agency: Agency) => void
  refetch: () => void
}

export function AgencyTable({ agencies, onEdit, refetch }: AgencyTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Adresse</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Utilisateurs</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agencies.map((agency) => (
            <AgencyTableRow
              key={agency.id}
              agency={agency}
              onEdit={onEdit}
              refetch={refetch}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}