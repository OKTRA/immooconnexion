import { Button } from "@/components/ui/button"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface PropertyActionsProps {
  propertyId: string
  onEdit: () => void
  onDelete: () => void
}

export function PropertyActions({ propertyId, onEdit, onDelete }: PropertyActionsProps) {
  const navigate = useNavigate()

  const handleViewProperty = () => {
    console.log("Attempting to navigate to property:", propertyId)
    if (!propertyId) {
      console.error("Property ID is missing")
      return
    }
    
    try {
      navigate(`/biens/${propertyId}`)
    } catch (error) {
      console.error("Navigation error:", error)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleViewProperty}
        title="Voir les détails"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onEdit}
        title="Modifier"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        title="Supprimer"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}