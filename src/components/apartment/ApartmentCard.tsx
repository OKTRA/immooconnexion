import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, Edit, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface ApartmentCardProps {
  apartment: {
    id: string
    name: string
    address: string
    unit_count: number
  }
  onViewUnits?: (apartmentId: string) => void
  onUpdate?: (apartmentId: string) => void
}

export function ApartmentCard({ apartment, onViewUnits, onUpdate }: ApartmentCardProps) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleViewUnits = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onViewUnits) {
      onViewUnits(apartment.id)
    } else {
      navigate(`/agence/appartements/${apartment.id}/details`)
    }
  }

  const handleUpdate = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onUpdate) {
      onUpdate(apartment.id)
    }
  }

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('apartments')
        .delete()
        .eq('id', apartment.id)

      if (error) throw error

      toast({
        title: "Appartement supprimé",
        description: "L'appartement a été supprimé avec succès"
      })
      
      // Refresh the page to update the list
      window.location.reload()
    } catch (error) {
      console.error('Error deleting apartment:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive"
      })
    }
  }

  return (
    <>
      <Card className="cursor-pointer transition-all hover:shadow-lg">
        <CardHeader>
          <CardTitle>{apartment.name}</CardTitle>
          <CardDescription>{apartment.address}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {apartment.unit_count} {apartment.unit_count === 1 ? "unité" : "unités"}
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleUpdate}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowDeleteDialog(true)
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleViewUnits}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Voir Unités
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement l'appartement et toutes ses unités.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}