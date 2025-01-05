import { Button } from "@/components/ui/button"
import { Ban, Edit, Building2, Trash2, UserPlus } from "lucide-react"
import { Agency } from "@/integrations/supabase/types/agencies"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useState } from "react"

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
          variant={agency.status === 'active' ? 'destructive' : 'outline'}
          size="sm"
          onClick={() => setShowBlockConfirm(true)}
        >
          <Ban className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <AlertDialog open={showBlockConfirm} onOpenChange={setShowBlockConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {agency.status === 'active' ? 'Bloquer cette agence ?' : 'Débloquer cette agence ?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {agency.status === 'active' 
                ? "Cette action empêchera tous les utilisateurs de l'agence de se connecter. Un email leur sera envoyé pour les informer."
                : "Cette action permettra aux utilisateurs de l'agence de se reconnecter."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              onToggleStatus()
              setShowBlockConfirm(false)
            }}>
              {agency.status === 'active' ? 'Bloquer' : 'Débloquer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}