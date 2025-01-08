import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"

interface UnitHeaderProps {
  unitNumber: string;
  apartmentName: string;
}

export function UnitHeader({ unitNumber, apartmentName }: UnitHeaderProps) {
  return (
    <div className="mb-6 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">
          Unité {unitNumber} - {apartmentName}
        </h1>
        <p className="text-muted-foreground">
          Détails et gestion de l'unité
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}