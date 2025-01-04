import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
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

interface DeleteApartmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedProperty: any | null
  onDelete: () => void
}

export function DeleteApartmentDialog({
  open,
  onOpenChange,
  selectedProperty,
  onDelete
}: DeleteApartmentDialogProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const handleDelete = async () => {
    if (!selectedProperty) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: profile } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile?.agency_id) throw new Error("Aucune agence associée")

      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', selectedProperty.id)
        .eq('agency_id', profile.agency_id)

      if (error) throw error

      queryClient.invalidateQueries({ queryKey: ['apartment-properties'] })

      toast({
        title: "Appartement supprimé",
        description: "L'appartement a été supprimé avec succès",
      })
      
      onDelete()
    } catch (error: any) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      })
    } finally {
      onOpenChange(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
  )
}