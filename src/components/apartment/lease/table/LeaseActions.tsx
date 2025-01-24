import { Button } from "@/components/ui/button"
import { Pencil, Trash2, CalendarRange, Loader2 } from "lucide-react"

interface LeaseActionsProps {
  lease: {
    id: string
    status: string
  }
  onEdit: (lease: any) => void
  onDelete: (id: string) => void
  onGeneratePeriods: (id: string) => void
  isGenerating: boolean
}

export function LeaseActions({ 
  lease, 
  onEdit, 
  onDelete,
  onGeneratePeriods,
  isGenerating 
}: LeaseActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(lease)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(lease.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      {lease.status === 'pending' && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onGeneratePeriods(lease.id)}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CalendarRange className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  )
}