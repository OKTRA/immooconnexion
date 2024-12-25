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
    navigate(`/biens/${propertyId}`)
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleViewProperty}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onEdit}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}