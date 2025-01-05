import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface PropertyUnit {
  id: string
  unit_number: string
  floor_number: number
  area: number
  status: string
  rent: number
  deposit: number
  category: string
  amenities: string[]
}

interface ApartmentUnitsTableProps {
  units: PropertyUnit[]
  onEdit: (unit: PropertyUnit) => void
  onDelete: (unitId: string) => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'available':
      return 'bg-green-500'
    case 'occupied':
      return 'bg-blue-500'
    case 'maintenance':
      return 'bg-yellow-500'
    case 'reserved':
      return 'bg-purple-500'
    default:
      return 'bg-gray-500'
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function ApartmentUnitsTable({ units, onEdit, onDelete }: ApartmentUnitsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>N° Unité</TableHead>
            <TableHead>Étage</TableHead>
            <TableHead>Surface</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Loyer</TableHead>
            <TableHead>Caution</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Équipements</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {units.map((unit) => (
            <TableRow key={unit.id}>
              <TableCell className="font-medium">{unit.unit_number}</TableCell>
              <TableCell>{unit.floor_number}</TableCell>
              <TableCell>{unit.area} m²</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {unit.category}
                </Badge>
              </TableCell>
              <TableCell>{formatPrice(unit.rent)}</TableCell>
              <TableCell>{formatPrice(unit.deposit)}</TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(unit.status)} text-white`}>
                  {unit.status === 'available' ? 'Disponible' :
                   unit.status === 'occupied' ? 'Occupé' :
                   unit.status === 'maintenance' ? 'Maintenance' :
                   unit.status === 'reserved' ? 'Réservé' : unit.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {unit.amenities.slice(0, 3).map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {unit.amenities.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{unit.amenities.length - 3}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(unit)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(unit.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {units.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">
                Aucune unité trouvée
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}