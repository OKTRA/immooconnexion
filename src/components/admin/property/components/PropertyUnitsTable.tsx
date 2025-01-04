import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2 } from "lucide-react"
import { PropertyUnit } from "../types/propertyUnit"

interface PropertyUnitsTableProps {
  units: PropertyUnit[]
  onEdit: (unit: PropertyUnit) => void
  onDelete: (unitId: string) => void
}

export function PropertyUnitsTable({ units, onEdit, onDelete }: PropertyUnitsTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Numéro d'unité</TableHead>
            <TableHead className="font-semibold">Étage</TableHead>
            <TableHead className="font-semibold">Surface (m²)</TableHead>
            <TableHead className="font-semibold">Loyer</TableHead>
            <TableHead className="font-semibold">Catégorie</TableHead>
            <TableHead className="font-semibold">Statut</TableHead>
            <TableHead className="font-semibold text-right pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {units.map((unit) => (
            <TableRow key={unit.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{unit.unit_number}</TableCell>
              <TableCell>{unit.floor_number || "-"}</TableCell>
              <TableCell>{unit.area || "-"}</TableCell>
              <TableCell>{unit.rent ? `${unit.rent.toLocaleString()} FCFA` : "-"}</TableCell>
              <TableCell className="capitalize">{unit.category || "Standard"}</TableCell>
              <TableCell>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  unit.status === 'available' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {unit.status === 'available' ? 'Disponible' : 'Occupé'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2 pr-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(unit)}
                    className="hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(unit.id)}
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {units.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                Aucune unité trouvée pour cette propriété
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}