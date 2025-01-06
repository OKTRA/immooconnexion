import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Building2, Edit, Plus, Trash } from "lucide-react"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { ApartmentUnitsTable } from "@/components/apartment/ApartmentUnitsTable"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ApartmentForm } from "@/components/apartment/ApartmentForm"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { ApartmentUnit } from "@/components/apartment/types"

export default function ApartmentDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const { data: apartment, isLoading } = useQuery({
    queryKey: ["apartment", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apartments")
        .select(`
          *,
          apartment_units (*)
        `)
        .eq("id", id)
        .single()

      if (error) throw error
      return data
    },
  })

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("apartments")
        .delete()
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Appartement supprimé",
        description: "L'appartement a été supprimé avec succès",
      })
      navigate("/agence/appartements")
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (unit: ApartmentUnit) => {
    navigate(`/agence/appartements/${id}/unites/${unit.id}`)
  }

  const handleUnitDelete = async (unitId: string) => {
    try {
      const { error } = await supabase
        .from("apartment_units")
        .delete()
        .eq("id", unitId)

      if (error) throw error

      toast({
        title: "Unité supprimée",
        description: "L'unité a été supprimée avec succès",
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <AgencyLayout>
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-muted rounded mb-4" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </AgencyLayout>
    )
  }

  if (!apartment) {
    return (
      <AgencyLayout>
        <Card>
          <CardHeader>
            <CardTitle>Appartement non trouvé</CardTitle>
            <CardDescription>
              Cet appartement n'existe pas ou a été supprimé
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/agence/appartements")}>
              Retour aux appartements
            </Button>
          </CardContent>
        </Card>
      </AgencyLayout>
    )
  }

  return (
    <AgencyLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{apartment.name}</h1>
          <p className="text-muted-foreground">{apartment.address}</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier l'appartement</DialogTitle>
              </DialogHeader>
              <ApartmentForm 
                initialData={apartment}
                isEditing={true}
              />
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Cela supprimera définitivement l'appartement
                  et toutes ses unités.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Adresse</dt>
                <dd>{apartment.address}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                <dd>{apartment.description || "Aucune description"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Nombre d'unités</dt>
                <dd>{apartment.apartment_units.length}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Separator />

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Unités</h2>
            <Button onClick={() => navigate(`/agence/appartements/${id}/unites/nouveau`)}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle unité
            </Button>
          </div>
          <ApartmentUnitsTable
            units={apartment.apartment_units}
            onEdit={handleEdit}
            onDelete={handleUnitDelete}
          />
        </div>
      </div>
    </AgencyLayout>
  )
}