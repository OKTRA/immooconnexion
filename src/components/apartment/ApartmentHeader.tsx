import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Apartment } from "@/types/apartment"

interface ApartmentHeaderProps {
  apartment?: Apartment | null
  isLoading?: boolean
}

export function ApartmentHeader({ apartment, isLoading }: ApartmentHeaderProps) {
  if (isLoading) {
    return <div className="h-24 animate-pulse bg-muted rounded-lg" />
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {apartment ? apartment.name : "Appartements"}
          </h1>
          {apartment?.address && (
            <p className="text-muted-foreground">{apartment.address}</p>
          )}
        </div>
        {!apartment && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvel appartement
          </Button>
        )}
      </div>
      {apartment?.description && (
        <p className="text-muted-foreground">{apartment.description}</p>
      )}
    </div>
  )
}