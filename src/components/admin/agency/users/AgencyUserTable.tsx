import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AgencyUserActions } from "../AgencyUserActions"

interface AgencyUserTableProps {
  users: any[]
  onEdit: (user: any) => void
  refetch: () => void
}

export function AgencyUserTable({ users, onEdit, refetch }: AgencyUserTableProps) {
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
              <TableCell>{user.email || "-"}</TableCell>
              <TableCell>
                <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                  {user.role || "user"}
                </Badge>
              </TableCell>
              <TableCell>
                <AgencyUserActions
                  userId={user.id}
                  onEdit={() => onEdit(user)}
                  refetch={refetch}
                />
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Aucun utilisateur trouvé pour cette agence
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}