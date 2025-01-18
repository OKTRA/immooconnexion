import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, Edit, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"

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

  // Fetch real-time unit count
  const { data: unitCount = 0 } = useQuery({
    queryKey: ['apartment-units-count', apartment.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('apartment_units')
        .select('id', { count: 'exact' })
        .eq('apartment_id', apartment.id)

      if (error) throw error
      return data?.length || 0
    }
  })

  const handleViewUnits = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onViewUnits) {
      onViewUnits(apartment.id)
    } else {
      navigate(`/agence/apartments/${apartment.id}/units`)
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
      // First check if there are any units
      const { data: units, error: checkError } = await supabase
        .from('apartment_units')
        .select('id')
        .eq('apartment_id', apartment.id)

      if (checkError) throw checkError

      if (units && units.length > 0) {
        toast({
          title: "Action impossible",
          description: "Vous devez d'abord supprimer toutes les unités de cet appartement avant de pouvoir le supprimer.",
          variant: "destructive"
        })
        setShowDeleteDialog(false)
        return
      }

      // If no units, proceed with apartment deletion
      const { error: apartmentError } = await supabase
        .from('apartments')
        .delete()
        .eq('id', apartment.id)

      if (apartmentError) throw apartmentError

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
                {unitCount} {unitCount === 1 ? "unité" : "unités"}
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
              Cette action est irréversible. L'appartement sera définitivement supprimé.
              Note: Vous devez d'abord supprimer toutes les unités associées avant de pouvoir supprimer l'appartement.
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