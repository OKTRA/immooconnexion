import {
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { ResponsiveTable } from "@/components/ui/responsive-table"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { PropertyDialog } from "./PropertyDialog"
import { useToast } from "./ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { PropertyTableHeader } from "./property-table/PropertyTableHeader"
import { PropertyTableRow } from "./property-table/PropertyTableRow"

interface Property {
  id: string
  bien: string
  type: string
  chambres: number
  ville: string
  loyer: number
  frais_agence: number
  taux_commission: number
  caution: number
  statut: string
  photo_url: string | null
  user_id: string
  agency_id: string
  created_at: string
  updated_at: string
  total_units: number
  property_category: string
}

export function PropertyTable() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      console.log("Début de la récupération des biens...")
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.error("Utilisateur non authentifié")
        throw new Error("Non authentifié")
      }
      console.log("User ID:", user.id)

      // Get user profile and check admin status
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, agency_id')
        .eq('id', user.id)
        .maybeSingle()

      console.log("Profil utilisateur:", profile)

      // Check administrator status
      const { data: adminData } = await supabase
        .from('administrators')
        .select('is_super_admin')
        .eq('id', user.id)
        .maybeSingle()

      let query = supabase
        .from('properties')
        .select('*')

      // If user is not admin or super admin, filter by agency_id
      if (!adminData?.is_super_admin && profile?.role !== 'admin') {
        if (profile?.agency_id) {
          query = query.eq('agency_id', profile.agency_id)
        } else {
          // If user has no agency_id, return empty array
          return []
        }
      }

      const { data, error } = await query

      if (error) {
        console.error("Erreur lors de la récupération des biens:", error)
        throw error
      }

      console.log("Biens récupérés:", data)
      return data as Property[]
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

      queryClient.invalidateQueries({ queryKey: ['properties'] })

      toast({
        title: "Bien supprimé",
        description: "Le bien a été supprimé avec succès",
      })
    } catch (error) {
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
    <div className="space-y-4 w-full overflow-x-auto">
      <div className="min-w-full">
        <ResponsiveTable>
          <PropertyTableHeader type="property" />
          <ResponsiveTable.Body>
            {properties && properties.map((property) => (
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
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement le bien
              et toutes les données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PropertyDialog
        property={selectedProperty}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </div>
  )
}