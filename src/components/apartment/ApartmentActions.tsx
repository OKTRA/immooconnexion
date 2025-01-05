import { Button } from "@/components/ui/button"
import { Building2, Edit, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface ApartmentActionsProps {
  apartmentId: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ApartmentActions({ apartmentId, onEdit, onDelete }: ApartmentActionsProps) {
  const navigate = useNavigate()

  const handleManageUnits = () => {
    navigate(`/agence/appartements/${apartmentId}/unites`)
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        onClick={handleManageUnits}
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
        size="sm"
      >
        <Building2 className="h-4 w-4 mr-2" />
        Gérer les unités
      </Button>
      
      {onEdit && (
        <Button
          onClick={onEdit}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      
      {onDelete && (
        <Button
          onClick={onDelete}
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-500 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}