import { useNavigate } from "react-router-dom"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ApartmentUnit {
  id: string
  unit_number: string
  floor_number: number | null
  area: number | null
  rent_amount: number
  deposit_amount: number | null
  status: string
}

interface ApartmentUnitsTableProps {
  units: ApartmentUnit[]
  apartmentId: string
  onEdit?: (unit: ApartmentUnit) => void
  onDelete?: (unitId: string) => void
}

export function ApartmentUnitsTable({ 
  units, 
  apartmentId,
  onEdit, 
  onDelete 
}: ApartmentUnitsTableProps) {
  const navigate = useNavigate()

  const handleView = (unitId: string) => {
    navigate(`/agence/apartments/${apartmentId}/units/${unitId}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500'
      case 'occupied':
        return 'bg-blue-500'
      case 'maintenance':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numéro</TableHead>
            <TableHead>Étage</TableHead>
            <TableHead>Surface (m²)</TableHead>
            <TableHead>Loyer</TableHead>
            <TableHead>Caution</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {units.map((unit) => (
            <TableRow key={unit.id}>
              <TableCell>{unit.unit_number}</TableCell>
              <TableCell>{unit.floor_number || '-'}</TableCell>
              <TableCell>{unit.area || '-'}</TableCell>
              <TableCell>{unit.rent_amount.toLocaleString()} FCFA</TableCell>
              <TableCell>
                {unit.deposit_amount 
                  ? `${unit.deposit_amount.toLocaleString()} FCFA` 
                  : '-'
                }
              </TableCell>
              <TableCell>
                <Badge 
                  variant="secondary"
                  className={getStatusColor(unit.status)}
                >
                  {unit.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleView(unit.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(unit)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(unit.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}