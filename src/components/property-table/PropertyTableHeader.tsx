import { TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function PropertyTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Bien</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>Chambres</TableHead>
        <TableHead>Ville</TableHead>
        <TableHead>Loyer</TableHead>
        <TableHead>Caution</TableHead>
        <TableHead>Statut</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  )
}