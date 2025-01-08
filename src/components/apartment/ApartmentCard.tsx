import { Card, CardContent } from "@/components/ui/card"
import { Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

interface Apartment {
  id: string
  name: string
  address?: string
  unit_count: number
}

interface ApartmentCardProps {
  apartment: Apartment
  onViewUnits?: (id: string) => void
}

export function ApartmentCard({ apartment, onViewUnits }: ApartmentCardProps) {
  const navigate = useNavigate()

  const handleViewUnits = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onViewUnits) {
      onViewUnits(apartment.id)
    } else {
      navigate(`/agence/apartments/${apartment.id}/details`)
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleViewUnits}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{apartment.name}</h3>
            {apartment.address && (
              <p className="text-sm text-muted-foreground">{apartment.address}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {apartment.unit_count} unité{apartment.unit_count !== 1 ? 's' : ''}
            </p>
          </div>
          <Building2 className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="mt-4">
          <Button onClick={handleViewUnits} className="w-full">
            Voir Unités
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}