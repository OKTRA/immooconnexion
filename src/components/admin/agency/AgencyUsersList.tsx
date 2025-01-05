import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AgencyUserActions } from "./AgencyUserActions"
import { Profile } from "../profile/types"

interface AgencyUsersListProps {
  users: Profile[]
  onEdit: (userId: string) => void
  onDelete: (userId: string) => Promise<void>
}

export function AgencyUsersList({ users, onEdit, onDelete }: AgencyUsersListProps) {
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
                  onEdit={() => onEdit(user.id)}
                  onDelete={() => onDelete(user.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}