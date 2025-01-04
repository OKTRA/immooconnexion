import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PropertySaleDialogProps {
  propertyId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PropertySaleDialog({ propertyId, open, onOpenChange }: PropertySaleDialogProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    buyer_name: "",
    buyer_contact: "",
    sale_price: "",
    commission_amount: "",
    sale_date: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const { data: profile } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', user.id)
        .single()

      if (!profile?.agency_id) throw new Error("Aucune agence associée")

      const { error } = await supabase
        .from('property_sales')
        .insert({
          property_id: propertyId,
          buyer_name: formData.buyer_name,
          buyer_contact: formData.buyer_contact,
          sale_price: parseInt(formData.sale_price),
          commission_amount: parseInt(formData.commission_amount),
          sale_date: formData.sale_date,
          agency_id: profile.agency_id
        })

      if (error) throw error

      toast({
        title: "Vente enregistrée",
        description: "La vente a été enregistrée avec succès"
      })

      queryClient.invalidateQueries({ queryKey: ['property-sales'] })
      onOpenChange(false)
    } catch (error: any) {
      console.error('Error recording sale:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'enregistrement de la vente",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Enregistrer une vente</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="buyer_name">Nom de l'acheteur</Label>
              <Input
                id="buyer_name"
                value={formData.buyer_name}
                onChange={(e) => setFormData({ ...formData, buyer_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buyer_contact">Contact de l'acheteur</Label>
              <Input
                id="buyer_contact"
                value={formData.buyer_contact}
                onChange={(e) => setFormData({ ...formData, buyer_contact: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sale_price">Prix de vente (FCFA)</Label>
              <Input
                id="sale_price"
                type="number"
                value={formData.sale_price}
                onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commission_amount">Commission (FCFA)</Label>
              <Input
                id="commission_amount"
                type="number"
                value={formData.commission_amount}
                onChange={(e) => setFormData({ ...formData, commission_amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sale_date">Date de vente</Label>
              <Input
                id="sale_date"
                type="date"
                value={formData.sale_date}
                onChange={(e) => setFormData({ ...formData, sale_date: e.target.value })}
              />
            </div>
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}