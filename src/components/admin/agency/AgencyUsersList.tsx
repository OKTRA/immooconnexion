import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AgencyUserActions } from "./AgencyUserActions"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import { ProfileForm } from "../profile/ProfileForm"

interface AgencyUsersListProps {
  users: any[]
  onEdit: (user: any) => void
  refetch: () => void
}

export function AgencyUsersList({ users, onEdit, refetch }: AgencyUsersListProps) {
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const handleEditAuth = (user: any) => {
    setSelectedUser(user)
    setShowAuthDialog(true)
  }

  const handleEditProfile = (user: any) => {
    setSelectedUser(user)
    setShowProfileDialog(true)
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
                  onEditAuth={() => handleEditAuth(user)}
                  onEditProfile={() => handleEditProfile(user)}
                  refetch={refetch}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier les informations d'authentification</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <ProfileForm
              newProfile={selectedUser}
              setNewProfile={onEdit}
              isEditing={true}
              step={1}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le profil</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <ProfileForm
              newProfile={selectedUser}
              setNewProfile={onEdit}
              isEditing={true}
              step={2}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}