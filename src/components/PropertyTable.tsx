import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const properties = [
  {
    bien: "Appartement A101",
    locataire: "Jean Dupont",
    statut: "Occupé",
    loyer: "1200 €",
  },
  {
    bien: "Maison M201",
    locataire: "Marie Martin",
    statut: "Occupé",
    loyer: "1500 €",
  },
]

export function PropertyTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bien</TableHead>
            <TableHead>Locataire</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Loyer</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow key={property.bien}>
              <TableCell>{property.bien}</TableCell>
              <TableCell>{property.locataire}</TableCell>
              <TableCell>{property.statut}</TableCell>
              <TableCell>{property.loyer}</TableCell>
              <TableCell>
                <button className="text-primary hover:underline">Voir</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}