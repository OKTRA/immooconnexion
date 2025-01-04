import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ApartmentIdFieldProps {
  propertyId: string;
}

export function ApartmentIdField({ propertyId }: ApartmentIdFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="apartment_id">ID de l'appartement</Label>
      <Input
        id="apartment_id"
        value={propertyId}
        disabled
        className="bg-muted"
      />
    </div>
  )
}