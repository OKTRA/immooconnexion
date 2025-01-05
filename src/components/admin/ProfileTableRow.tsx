import { TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ProfileActions } from "./ProfileActions"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ProfileForm } from "./profile/ProfileForm"
import { Profile } from "./profile/types"

interface ProfileTableRowProps {
  profile: Profile & {
    agency_name?: string;
    created_at: string;
  }
  onEdit: (profile: Profile) => void
  refetch: () => void
}

export function ProfileTableRow({ profile, onEdit, refetch }: ProfileTableRowProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editedProfile, setEditedProfile] = useState<Profile>({
    id: profile.id || "",
    email: profile.email || "",
    password: "",
    first_name: profile.first_name || "",
    last_name: profile.last_name || "",
    phone_number: profile.phone_number || "",
    role: profile.role || "user"
  })

  const handleSubmit = async () => {
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
        <TableCell>{profile.phone_number || "-"}</TableCell>
        <TableCell>{profile.agency_name || "-"}</TableCell>
        <TableCell>
          <Badge variant={profile.role === "admin" ? "default" : profile.role === "user" ? "secondary" : "destructive"}>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le profil</DialogTitle>
          </DialogHeader>
          <ProfileForm 
            newProfile={editedProfile} 
            setNewProfile={setEditedProfile}
            onSuccess={handleSubmit}
            isEditing={true}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}