import { TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ProfileActions } from "./ProfileActions"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProfileForm } from "./profile/ProfileForm"
import { Profile as AdminProfile } from "./profile/types"
import { Profile } from "@/types/profile"

interface ProfileTableRowProps {
  profile: Profile;
  onEdit: (profile: Profile) => void;
  refetch: () => void;
}

export function ProfileTableRow({ profile, onEdit, refetch }: ProfileTableRowProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editedProfile, setEditedProfile] = useState<AdminProfile>({
    id: profile.id,
    email: profile.email || "",
    password: "", // Add empty password for edit form
    first_name: profile.first_name || "",
    last_name: profile.last_name || "",
    phone_number: profile.phone_number || "",
    role: profile.role,
    agency_id: profile.agency_id,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
    is_tenant: profile.is_tenant,
    status: profile.status,
    has_seen_warning: profile.has_seen_warning,
    agency_name: profile.agency_name
  })

  const handleSubmit = async () => {
    const profileToUpdate: Profile = {
      id: editedProfile.id!,
      email: editedProfile.email,
      first_name: editedProfile.first_name,
      last_name: editedProfile.last_name,
      phone_number: editedProfile.phone_number,
      role: editedProfile.role,
      agency_id: editedProfile.agency_id || null,
      created_at: editedProfile.created_at || new Date().toISOString(),
      updated_at: editedProfile.updated_at || new Date().toISOString(),
      is_tenant: editedProfile.is_tenant || false,
      status: editedProfile.status || 'active',
      has_seen_warning: editedProfile.has_seen_warning || false,
      agency_name: editedProfile.agency_name
    }
    onEdit(profileToUpdate)
    setShowEditDialog(false)
  }

  const getBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default"
      case "super_admin":
        return "destructive"
      default:
        return "secondary"
    }
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
          <Badge variant={getBadgeVariant(profile.role)}>
            {profile.role || "user"}
          </Badge>
        </TableCell>
        <TableCell>
          {format(new Date(profile.created_at), "Pp", { locale: fr })}
        </TableCell>
        <TableCell>
          <ProfileActions
            profile={{
              id: profile.id,
              role: profile.role
            }}
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