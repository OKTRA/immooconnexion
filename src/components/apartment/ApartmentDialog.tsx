import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"

interface ApartmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  apartment: any | null
}

export function ApartmentDialog({ apartment, onOpenChange, open }: ApartmentDialogProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    name: apartment?.name || '',
    city: apartment?.city || '',
    country: apartment?.country || '',
    total_units: apartment?.total_units || '',
    owner_name: apartment?.owner_name || '',
    owner_phone: apartment?.owner_phone || '',
  })

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: profile } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile?.agency_id) throw new Error("Aucune agence associée")

      const updates = {
        ...formData,
        agency_id: profile.agency_id,
        created_by_user_id: user.id,
        updated_at: new Date().toISOString(),
      }

      let error
      if (apartment) {
        const { error: updateError } = await supabase
          .from('apartments')
          .update(updates)
          .eq('id', apartment.id)
        error = updateError
      } else {
        const { error: insertError } = await supabase
          .from('apartments')
          .insert([updates])
        error = insertError
      }

      if (error) throw error

      queryClient.invalidateQueries({ queryKey: ['apartment-properties'] })
      
      toast({
        title: apartment ? "Appartement modifié" : "Appartement ajouté",
        description: apartment ? "L'appartement a été modifié avec succès" : "L'appartement a été ajouté avec succès",
      })
      
      onOpenChange(false)
    } catch (error: any) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] h-[90vh] p-6 overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {apartment ? "Modifier l'appartement" : "Ajouter un nouvel appartement"}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 h-[calc(90vh-180px)] pr-4 -mr-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nom</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded-md mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Ville</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-2 border rounded-md mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Pays</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full p-2 border rounded-md mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Nombre d'unités</label>
              <input
                type="number"
                value={formData.total_units}
                onChange={(e) => setFormData({ ...formData, total_units: e.target.value })}
                className="w-full p-2 border rounded-md mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Nom du propriétaire</label>
              <input
                type="text"
                value={formData.owner_name}
                onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                className="w-full p-2 border rounded-md mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Téléphone du propriétaire</label>
              <input
                type="text"
                value={formData.owner_phone}
                onChange={(e) => setFormData({ ...formData, owner_phone: e.target.value })}
                className="w-full p-2 border rounded-md mt-1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6 sticky bottom-0 bg-background py-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              {apartment ? "Modifier" : "Enregistrer"}
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}