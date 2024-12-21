import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"

const properties = [
  {
    id: 1,
    bien: "Appartement Jaune Block 1",
    type: "Appartement",
    chambres: 3,
    ville: "Kati",
    loyer: "60000",
    caution: "120000",
    statut: "Occupé",
  },
  {
    id: 2,
    bien: "Maison M201",
    type: "Maison",
    chambres: 4,
    ville: "Bamako",
    loyer: "75000",
    caution: "150000",
    statut: "Libre",
  },
]

export function PropertyTable() {
  const navigate = useNavigate()

  return (
    <div className="rounded-md border">
      <Table>
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
        <TableBody>
          {properties.map((property) => (
            <TableRow key={property.id}>
              <TableCell>{property.bien}</TableCell>
              <TableCell>{property.type}</TableCell>
              <TableCell>{property.chambres}</TableCell>
              <TableCell>{property.ville}</TableCell>
              <TableCell>{property.loyer} FCFA</TableCell>
              <TableCell>{property.caution} FCFA</TableCell>
              <TableCell>{property.statut}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/biens/${property.id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}