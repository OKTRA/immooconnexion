import { Button } from "@/components/ui/button"
import { Building2, Edit, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface PropertyActionsProps {
  propertyId: string
  onEdit: () => void
  onDelete: () => void
  propertyType: string
}

export function PropertyActions({ propertyId, onEdit, onDelete, propertyType }: PropertyActionsProps) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-2">
      {propertyType === 'appartement' && (
        <Button 
          variant="outline"
          size="sm"
          className="bg-dashboard-gradient-from hover:bg-dashboard-gradient-to text-white transition-colors"
          onClick={() => navigate(`/agence/appartements/${propertyId}/unites`)}
        >
          <Building2 className="h-4 w-4 mr-2" />
          Gérer les unités
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={onEdit}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}