import { TableCell, TableRow } from "@/components/ui/table"
import { PropertyActions } from "./PropertyActions"

interface Property {
  id: string
  bien: string
  type: string
  chambres: number
  ville: string
  loyer: number
  caution: number
  statut: string
  total_units: number
  property_category: string
}

interface PropertyTableRowProps {
  property: Property
  onEdit: () => void
  onDelete: () => void
}

export function PropertyTableRow({ property, onEdit, onDelete }: PropertyTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{property.bien}</TableCell>
      <TableCell>{property.type}</TableCell>
      <TableCell>{property.chambres}</TableCell>
      <TableCell>{property.ville}</TableCell>
      <TableCell>{property.loyer} FCFA</TableCell>
      <TableCell>{property.caution} FCFA</TableCell>
      <TableCell>{property.statut}</TableCell>
      <TableCell>
        <PropertyActions
          propertyId={property.id}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  )
}