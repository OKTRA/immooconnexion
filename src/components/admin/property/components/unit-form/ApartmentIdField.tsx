import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ApartmentIdFieldProps {
  propertyId: string;
}

export function ApartmentIdField({ propertyId }: ApartmentIdFieldProps) {
  return (
    <div className="space-y-2">
      <Label>ID de l'appartement</Label>
      <Input
        value={propertyId}
        readOnly
        disabled
        className="bg-gray-100"
      />
    </div>
  )
}