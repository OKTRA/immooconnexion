import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface ApartmentUnitsButtonProps {
  apartmentId: string
}

export function ApartmentUnitsButton({ apartmentId }: ApartmentUnitsButtonProps) {
  const navigate = useNavigate()

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-2"
      onClick={() => navigate(`/agence/appartements/${apartmentId}/unites`)}
    >
      <Building2 className="h-4 w-4 mr-2" />
      Gérer les unités
    </Button>
  )
}