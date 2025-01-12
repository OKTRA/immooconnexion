import { Button } from "@/components/ui/button"
import { Trash, Pencil, Eye } from "lucide-react"
import { ApartmentUnit } from "@/types/apartment"
import { useNavigate } from "react-router-dom"

interface ApartmentUnitsTableProps {
  units: ApartmentUnit[]
  apartmentId: string
  isLoading?: boolean
  onEdit?: (unit: ApartmentUnit) => void
  onDelete?: (unitId: string) => void
}

export function ApartmentUnitsTable({ 
  units,
  apartmentId,
  isLoading,
  onEdit,
  onDelete
}: ApartmentUnitsTableProps) {
  const navigate = useNavigate()

  const handleViewDetails = (unitId: string) => {
    navigate(`/agence/apartments/${apartmentId}/units/${unitId}`)
  }

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-4 text-left">Numéro</th>
            <th className="p-4 text-left">Étage</th>
            <th className="p-4 text-left">Surface</th>
            <th className="p-4 text-left">Loyer</th>
            <th className="p-4 text-left">Caution</th>
            <th className="p-4 text-left">Statut</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {units.map((unit) => (
            <tr key={unit.id} className="border-b">
              <td className="p-4">{unit.unit_number}</td>
              <td className="p-4">{unit.floor_number || '-'}</td>
              <td className="p-4">{unit.area ? `${unit.area} m²` : '-'}</td>
              <td className="p-4">{unit.rent_amount.toLocaleString()} FCFA</td>
              <td className="p-4">
                {unit.deposit_amount ? `${unit.deposit_amount.toLocaleString()} FCFA` : '-'}
              </td>
              <td className="p-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    unit.status === 'available'
                      ? 'bg-green-100 text-green-800'
                      : unit.status === 'occupied'
                      ? 'bg-blue-100 text-blue-800'
                      : unit.status === 'maintenance'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {unit.status === 'available'
                    ? 'Disponible'
                    : unit.status === 'occupied'
                    ? 'Occupé'
                    : unit.status === 'maintenance'
                    ? 'En maintenance'
                    : 'Réservé'}
                </span>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewDetails(unit.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(unit)}
                    >
                      <Pencil className="h-4 w-4" />
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}