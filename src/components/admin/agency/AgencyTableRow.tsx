import { TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Users } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Agency } from "./types"
import { AgencyUsers } from "./AgencyUsers"
import { AgencyForm } from "./AgencyForm"

interface AgencyTableRowProps {
  agency: Agency
  onEdit: (agency: Agency) => void
  refetch: () => void
}

export function AgencyTableRow({ agency, onEdit, refetch }: AgencyTableRowProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showUsersDialog, setShowUsersDialog] = useState(false)
  const [editedAgency, setEditedAgency] = useState(agency)

  const handleSaveEdit = () => {
    onEdit(editedAgency)
    setShowEditDialog(false)
  }

  return (
    <>
      <TableRow>
        <TableCell>{agency.name}</TableCell>
        <TableCell>{agency.address || "-"}</TableCell>
        <TableCell>{agency.phone || "-"}</TableCell>
        <TableCell>{agency.email || "-"}</TableCell>
        <TableCell>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowUsersDialog(true)}
          >
            <Users className="h-4 w-4 mr-2" />
            Voir les utilisateurs
          </Button>
        </TableCell>
        <TableCell>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEditDialog(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </TableCell>
      </TableRow>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier l'agence</DialogTitle>
          </DialogHeader>
          <AgencyForm 
            agency={editedAgency} 
            setAgency={setEditedAgency} 
          />
          <Button onClick={handleSaveEdit} className="w-full">
            Enregistrer
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showUsersDialog} onOpenChange={setShowUsersDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Utilisateurs de l'agence {agency.name}</DialogTitle>
          </DialogHeader>
          <AgencyUsers agencyId={agency.id} />
        </DialogContent>
      </Dialog>
    </>
  )
}