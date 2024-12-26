import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AgencyUserActions } from "./AgencyUserActions"
import { useState } from "react"
import { useAgencyUserEdit } from "./hooks/useAgencyUserEdit"
import { AgencyUserEditDialog } from "./AgencyUserEditDialog"

interface AgencyUsersListProps {
  users: any[]
  onEdit: (user: any) => void
  refetch: () => void
  agencyId: string
}

export function AgencyUsersList({ users, refetch, agencyId }: AgencyUsersListProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const { editStep, setEditStep, handleUpdateAuth, handleUpdateProfile } = useAgencyUserEdit()

  const handleEditAuth = (user: any) => {
    setSelectedUser(user)
    setEditStep(1)
    setShowEditDialog(true)
  }

  const handleEditProfile = (user: any) => {
    setSelectedUser(user)
    setEditStep(2)
    setShowEditDialog(true)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Prénom</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Créé le</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.first_name || "-"}</TableCell>
              <TableCell>{user.last_name || "-"}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(user.created_at), "Pp", { locale: fr })}
              </TableCell>
              <TableCell>
                <AgencyUserActions
                  userId={user.id}
                  onEditAuth={() => handleEditAuth(user)}
                  onEditProfile={() => handleEditProfile(user)}
                  refetch={refetch}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AgencyUserEditDialog
        showEditDialog={showEditDialog}
        setShowEditDialog={setShowEditDialog}
        selectedUser={selectedUser}
        editStep={editStep}
        setEditStep={setEditStep}
        handleUpdateAuth={handleUpdateAuth}
        handleUpdateProfile={handleUpdateProfile}
        agencyId={agencyId}
      />
    </div>
  )
}