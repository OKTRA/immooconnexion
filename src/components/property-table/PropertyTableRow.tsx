import { Property } from "@/components/property/types"
import { PropertyActions } from "./PropertyActions"
import { ResponsiveTable } from "@/components/ui/responsive-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2 } from "lucide-react"
import { ReactNode } from "react"

interface PropertyTableRowProps {
  property: Property
  onEdit: () => void
  onDelete: () => void
  customActions?: ReactNode
}

export function PropertyTableRow({ property, onEdit, onDelete, customActions }: PropertyTableRowProps) {
  return (
    <ResponsiveTable.Row>
      <ResponsiveTable.Cell>
        <Avatar>
          <AvatarImage src={property.photo_url || ''} alt={property.bien} />
          <AvatarFallback>
            <Building2 className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </ResponsiveTable.Cell>
      <ResponsiveTable.Cell className="font-medium">{property.bien}</ResponsiveTable.Cell>
      <ResponsiveTable.Cell>{property.ville}</ResponsiveTable.Cell>
      <ResponsiveTable.Cell>{property.total_units}</ResponsiveTable.Cell>
      <ResponsiveTable.Cell>{property.owner_name}</ResponsiveTable.Cell>
      <ResponsiveTable.Cell>{property.owner_phone}</ResponsiveTable.Cell>
      <ResponsiveTable.Cell>{property.statut}</ResponsiveTable.Cell>
      <ResponsiveTable.Cell className="text-right space-x-2">
        <PropertyActions
          propertyId={property.id}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        {customActions}
      </ResponsiveTable.Cell>
    </ResponsiveTable.Row>
  )
}