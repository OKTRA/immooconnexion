import { TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function TenantsTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Nom</TableHead>
        <TableHead>Prénom</TableHead>
        <TableHead>Date de Naissance</TableHead>
        <TableHead>Téléphone</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  )
}