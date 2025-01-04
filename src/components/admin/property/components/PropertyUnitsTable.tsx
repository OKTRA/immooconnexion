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
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numéro d'unité</TableHead>
            <TableHead>Étage</TableHead>
            <TableHead>Surface (m²)</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {units.map((unit) => (
            <TableRow key={unit.id}>
              <TableCell>{unit.unit_number}</TableCell>
              <TableCell>{unit.floor_number || "-"}</TableCell>
              <TableCell>{unit.area || "-"}</TableCell>
              <TableCell>{unit.status}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(unit)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(unit.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {units.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Aucune unité trouvée pour cette propriété
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}