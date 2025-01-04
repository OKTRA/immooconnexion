import { PropertyActions } from "./PropertyActions"
import { Property } from "@/integrations/supabase/types/properties"
import { ResponsiveTable } from "@/components/ui/responsive-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2 } from "lucide-react"

interface PropertyTableRowProps {
  property: Property
  onEdit: () => void
  onDelete: () => void
}

export function PropertyTableRow({ property, onEdit, onDelete }: PropertyTableRowProps) {
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
      <ResponsiveTable.Cell>{property.type}</ResponsiveTable.Cell>
      <ResponsiveTable.Cell>{property.chambres}</ResponsiveTable.Cell>
      <ResponsiveTable.Cell>{property.ville}</ResponsiveTable.Cell>
      <ResponsiveTable.Cell>{property.loyer?.toLocaleString()} FCFA</ResponsiveTable.Cell>
      <ResponsiveTable.Cell>{property.caution?.toLocaleString()} FCFA</ResponsiveTable.Cell>
      <ResponsiveTable.Cell>{property.statut}</ResponsiveTable.Cell>
      <ResponsiveTable.Cell className="text-right">
        <PropertyActions
          propertyId={property.id}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </ResponsiveTable.Cell>
    </ResponsiveTable.Row>
  )
}