import { Table, TableBody, TableHead, TableHeader } from "@/components/ui/table"
import { ProfileTableRow } from "../ProfileTableRow"

interface ProfilesTableProps {
  profiles: any[]
  onEdit: (profile: any) => void
  refetch: () => void
}

export function ProfilesTable({ profiles, onEdit, refetch }: ProfilesTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableHead>ID</TableHead>
          <TableHead>Prénom</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Téléphone</TableHead>
          <TableHead>Agence</TableHead>
          <TableHead>Rôle</TableHead>
          <TableHead>Date de création</TableHead>
          <TableHead>Actions</TableHead>
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