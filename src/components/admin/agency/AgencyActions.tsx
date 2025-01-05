import { Button } from "@/components/ui/button"
import { Ban, Edit, Building2, Trash2, UserPlus } from "lucide-react"
import { Agency } from "@/integrations/supabase/types/agencies"
import { useState } from "react"
import { BlockAgencyDialog } from "./dialogs/BlockAgencyDialog"

interface AgencyActionsProps {
  agency: Agency
  onEdit: () => void
  onAddProfile: () => void
  onViewOverview: () => void
  onToggleStatus: () => void
  onDelete: () => void
}

export function AgencyActions({
  agency,
  onEdit,
  onAddProfile,
  onViewOverview,
  onToggleStatus,
  onDelete
}: AgencyActionsProps) {
  const [showBlockConfirm, setShowBlockConfirm] = useState(false)
  const isBlocked = agency.status === 'blocked'

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewOverview}
        >
          <Building2 className="h-4 w-4 mr-2" />
          Vue d'ensemble
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddProfile}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Ajouter un profil
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant={isBlocked ? 'outline' : 'destructive'}
          size="sm"
          onClick={() => setShowBlockConfirm(true)}
        >
          <Ban className="h-4 w-4 mr-2" />
          {isBlocked ? 'Débloquer' : 'Bloquer'}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <BlockAgencyDialog
        agency={agency}
        open={showBlockConfirm}
        onOpenChange={setShowBlockConfirm}
        onConfirm={() => {
          onToggleStatus()
          setShowBlockConfirm(false)
        }}
      />
    </>
  )
}