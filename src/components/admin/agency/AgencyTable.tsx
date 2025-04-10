import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AgencyTableRow } from "./AgencyTableRow"
import { Agency } from "./types"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddAgencyDialog } from "../profile/AddAgencyDialog"
import { useState } from "react"

export interface AgencyTableProps {
  agencies: Agency[]
  onEdit: (agency: Agency) => void
  refetch: () => void
}

export function AgencyTable({ agencies, onEdit, refetch }: AgencyTableProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Agences</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle agence
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Adresse</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Email</TableHead>
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

      <AddAgencyDialog 
        showDialog={showAddDialog}
        setShowDialog={setShowAddDialog}
        onAgencyCreated={refetch}
      />
    </div>
  )
}