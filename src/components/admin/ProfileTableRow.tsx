import { TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ProfileActions } from "./ProfileActions"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface ProfileTableRowProps {
  profile: any
  onEdit: (profile: any) => void
  refetch: () => void
}

export function ProfileTableRow({ profile, onEdit, refetch }: ProfileTableRowProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editedProfile, setEditedProfile] = useState(profile)

  const handleSaveEdit = () => {
    onEdit(editedProfile)
    setShowEditDialog(false)
  }

  return (
    <>
      <TableRow key={profile.id}>
        <TableCell className="font-mono">{profile.id}</TableCell>
        <TableCell>{profile.first_name || "-"}</TableCell>
        <TableCell>{profile.last_name || "-"}</TableCell>
        <TableCell>{profile.email || "-"}</TableCell>
        <TableCell>{profile.agency_name || "-"}</TableCell>
        <TableCell>
          <Badge variant={profile.role === "admin" ? "default" : profile.role === "blocked" ? "destructive" : "secondary"}>
            {profile.role || "user"}
          </Badge>
        </TableCell>
        <TableCell>
          {format(new Date(profile.created_at), "Pp", { locale: fr })}
        </TableCell>
        <TableCell>
          <ProfileActions
            profile={profile}
            onEdit={() => setShowEditDialog(true)}
            refetch={refetch}
          />
        </TableCell>
      </TableRow>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le profil</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                value={editedProfile.email}
                onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-first_name">Prénom</Label>
              <Input
                id="edit-first_name"
                value={editedProfile.first_name}
                onChange={(e) => setEditedProfile({ ...editedProfile, first_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-last_name">Nom</Label>
              <Input
                id="edit-last_name"
                value={editedProfile.last_name}
                onChange={(e) => setEditedProfile({ ...editedProfile, last_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-agency_name">Nom de l'agence</Label>
              <Input
                id="edit-agency_name"
                value={editedProfile.agency_name}
                onChange={(e) => setEditedProfile({ ...editedProfile, agency_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-role">Rôle</Label>
              <Select
                value={editedProfile.role}
                onValueChange={(value) => setEditedProfile({ ...editedProfile, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Utilisateur</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSaveEdit} className="w-full">
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}