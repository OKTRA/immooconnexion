import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProfileTableRow } from "../ProfileTableRow"

interface ProfilesTableProps {
  profiles: any[]
  onEdit: (profile: any) => void
  refetch: () => void
}

export function ProfilesTable({ profiles, onEdit, refetch }: ProfilesTableProps) {
  if (profiles.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun profil trouvé
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Agence</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((profile) => (
            <ProfileTableRow
              key={profile.id}
              profile={profile}
              onEdit={onEdit}
              refetch={refetch}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}