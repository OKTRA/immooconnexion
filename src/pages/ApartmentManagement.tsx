import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { AgencyLayout } from "@/components/agency/AgencyLayout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Home, Building } from "lucide-react"
import { ApartmentDialog } from "@/components/property/ApartmentDialog"
import { PropertyTableRow } from "@/components/property-table/PropertyTableRow"
import { ResponsiveTable } from "@/components/ui/responsive-table"
import { PropertyTableHeader } from "@/components/property-table/PropertyTableHeader"
import { useState } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"

export default function ApartmentManagement() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const { toast } = useToast()

  const { data: properties, isLoading } = useQuery({
    queryKey: ['apartment-properties'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: profile } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile?.agency_id) {
        throw new Error("Aucune agence associée")
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('agency_id', profile.agency_id)
        .eq('property_category', 'apartment')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  })

  const handleDelete = async () => {
    if (!selectedProperty) return

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', selectedProperty.id)

      if (error) throw error

      toast({
        title: "Appartement supprimé",
        description: "L'appartement a été supprimé avec succès",
      })
    } catch (error: any) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setSelectedProperty(null)
    }
  }

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <AgencyLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Appartements</h1>
          <ApartmentDialog />
        </div>

        <Tabs defaultValue="all" className="w-full space-y-6">
          <TabsList className="bg-white p-1 rounded-lg shadow-sm">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Building2 className="h-4 w-4 mr-2" />
              Tous
            </TabsTrigger>
            <TabsTrigger value="available" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Home className="h-4 w-4 mr-2" />
              Disponibles
            </TabsTrigger>
            <TabsTrigger value="occupied" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Building className="h-4 w-4 mr-2" />
              Occupés
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="bg-white rounded-lg shadow-sm">
            <ResponsiveTable>
              <PropertyTableHeader />
              <ResponsiveTable.Body>
                {properties?.map((property) => (
                  <PropertyTableRow
                    key={property.id}
                    property={property}
                    onEdit={() => {
                      setSelectedProperty(property)
                      setEditDialogOpen(true)
                    }}
                    onDelete={() => {
                      setSelectedProperty(property)
                      setDeleteDialogOpen(true)
                    }}
                  />
                ))}
              </ResponsiveTable.Body>
            </ResponsiveTable>
          </TabsContent>

          <TabsContent value="available" className="bg-white rounded-lg shadow-sm">
            <ResponsiveTable>
              <PropertyTableHeader />
              <ResponsiveTable.Body>
                {properties?.filter(p => p.statut === 'disponible').map((property) => (
                  <PropertyTableRow
                    key={property.id}
                    property={property}
                    onEdit={() => {
                      setSelectedProperty(property)
                      setEditDialogOpen(true)
                    }}
                    onDelete={() => {
                      setSelectedProperty(property)
                      setDeleteDialogOpen(true)
                    }}
                  />
                ))}
              </ResponsiveTable.Body>
            </ResponsiveTable>
          </TabsContent>

          <TabsContent value="occupied" className="bg-white rounded-lg shadow-sm">
            <ResponsiveTable>
              <PropertyTableHeader />
              <ResponsiveTable.Body>
                {properties?.filter(p => p.statut === 'occupé').map((property) => (
                  <PropertyTableRow
                    key={property.id}
                    property={property}
                    onEdit={() => {
                      setSelectedProperty(property)
                      setEditDialogOpen(true)
                    }}
                    onDelete={() => {
                      setSelectedProperty(property)
                      setDeleteDialogOpen(true)
                    }}
                  />
                ))}
              </ResponsiveTable.Body>
            </ResponsiveTable>
          </TabsContent>
        </Tabs>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Cela supprimera définitivement l'appartement
                et toutes les données associées.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <ApartmentDialog
          property={selectedProperty}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      </div>
    </AgencyLayout>
  )
}