import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface UnitHeaderProps {
  unitNumber: string
  apartmentName: string
}

export function UnitHeader({ unitNumber, apartmentName }: UnitHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          Unité {unitNumber} - {apartmentName}
        </h1>
      </div>
    </div>
  )
}