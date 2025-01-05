import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AgencyUserActions } from "./AgencyUserActions"
import { useState } from "react"
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

  const handleEditUser = (user: any) => {
    setSelectedUser(user)
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
                <AgencyUserActions
                  userId={user.id}
                  onEditProfile={() => handleEditUser(user)}
                  refetch={refetch}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AgencyUserEditDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        userId={selectedUser?.id}
        agencyId={agencyId}
        onSuccess={refetch}
      />
    </div>
  )
}