import { Button } from "@/components/ui/button"
import { Eye, Pencil, Trash2, Building2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface PropertyActionsProps {
  propertyId: string
  onEdit: () => void
  onDelete: () => void
  propertyType?: string
}

export function PropertyActions({ propertyId, onEdit, onDelete, propertyType }: PropertyActionsProps) {
  const navigate = useNavigate()

  const handleViewProperty = () => {
    navigate(`/agence/biens/${propertyId}`)
  }

  const handleManageUnits = () => {
    navigate(`/agence/appartements/${propertyId}/unites`)
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleViewProperty}
        className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
        title="Voir les détails"
      >
        <Eye className="h-4 w-4" />
      </Button>
      {propertyType === 'apartment' && (
        <Button
          onClick={handleManageUnits}
          className="bg-gradient-to-r from-dashboard-gradient-from to-dashboard-gradient-to text-white hover:opacity-90 transition-opacity"
          size="sm"
        >
          <Building2 className="h-4 w-4 mr-2" />
          Gérer les unités
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={onEdit}
        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        title="Modifier"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
        title="Supprimer"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}