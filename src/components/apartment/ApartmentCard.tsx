import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface ApartmentCardProps {
  apartment: {
    id: string
    name: string
    address: string
    unit_count: number
  }
  onViewUnits?: (apartmentId: string) => void
}

export function ApartmentCard({ apartment, onViewUnits }: ApartmentCardProps) {
  const navigate = useNavigate()

  const handleViewUnits = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onViewUnits) {
      onViewUnits(apartment.id)
    } else {
      navigate(`/agence/appartements/${apartment.id}/unites`)
    }
  }

  return (
    <Card className="cursor-pointer transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle>{apartment.name}</CardTitle>
        <CardDescription>{apartment.address}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">
            {apartment.unit_count} {apartment.unit_count === 1 ? "unité" : "unités"}
          </span>
          <Button 
            variant="default" 
            size="sm"
            onClick={handleViewUnits}
          >
            <Home className="w-4 h-4 mr-2" />
            Voir Unités
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}