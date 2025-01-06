import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EditProfileDialogProps } from "../types"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function AgencyUserEditDialog({ open, onOpenChange, userId, agencyId, onSuccess }: EditProfileDialogProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { handleSubmit } = useForm()

  const onSubmit = async () => {
    try {
      setLoading(true)
      
      const { error } = await supabase
        .from('profiles')
        .update({ agency_id: agencyId })
        .eq('id', userId)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Le profil a été mis à jour avec succès",
      })

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du profil",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Mise à jour..." : "Mettre à jour"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}