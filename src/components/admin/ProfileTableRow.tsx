import { TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ProfileActions } from "./ProfileActions"

interface ProfileTableRowProps {
  profile: any
  onEdit: (profile: any) => void
  refetch: () => void
}

export function ProfileTableRow({ profile, onEdit, refetch }: ProfileTableRowProps) {
  return (
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
          onEdit={onEdit}
          refetch={refetch}
        />
      </TableCell>
    </TableRow>
  )
}