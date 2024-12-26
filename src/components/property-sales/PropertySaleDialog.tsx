import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useSubscriptionLimits } from "@/utils/subscriptionLimits"

interface PropertySaleDialogProps {
  propertyId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: any
  isEditing?: boolean
}

export function PropertySaleDialog({ 
  propertyId, 
  open, 
  onOpenChange, 
  initialData,
  isEditing 
}: PropertySaleDialogProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const { checkAndNotifyLimits } = useSubscriptionLimits()

  const [formData, setFormData] = useState({
    buyer_name: initialData?.buyer_name || "",
    buyer_contact: initialData?.buyer_contact || "",
    sale_price: initialData?.sale_price || "",
    commission_amount: initialData?.commission_amount || "",
    sale_date: initialData?.sale_date || new Date().toISOString().split('T')[0]
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files)
    }
  }

  const uploadPhotos = async (agencyId: string) => {
    if (!selectedFiles) return []

    const photoUrls = []
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      const fileExt = file.name.split('.').pop()
      const fileName = `${crypto.randomUUID()}.${fileExt}`
      const filePath = `${agencyId}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('property_sale_photos')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('property_sale_photos')
        .getPublicUrl(filePath)

      photoUrls.push(publicUrl)
    }

    return photoUrls
  }

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

      // Vérifier le plan d'abonnement
      const canManageSales = await checkAndNotifyLimits(profile.agency_id, 'property')
      if (!canManageSales) {
        toast({
          title: "Plan limité",
          description: "La gestion des ventes nécessite un abonnement Professionnel ou Enterprise",
          variant: "destructive"
        })
        return
      }

      let photoUrls: string[] = []
      if (selectedFiles) {
        photoUrls = await uploadPhotos(profile.agency_id)
      }

      const saleData = {
        property_id: propertyId,
        buyer_name: formData.buyer_name,
        buyer_contact: formData.buyer_contact,
        sale_price: parseInt(formData.sale_price),
        commission_amount: parseInt(formData.commission_amount),
        sale_date: formData.sale_date,
        agency_id: profile.agency_id,
        photo_urls: photoUrls
      }

      if (isEditing && initialData?.id) {
        const { error } = await supabase
          .from('property_sales')
          .update(saleData)
          .eq('id', initialData.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('property_sales')
          .insert([saleData])

        if (error) throw error
      }

      toast({
        title: isEditing ? "Vente mise à jour" : "Vente enregistrée",
        description: isEditing ? 
          "La vente a été mise à jour avec succès" : 
          "La vente a été enregistrée avec succès"
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier la vente" : "Enregistrer une vente"}
          </DialogTitle>
        </DialogHeader>
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
          <div className="space-y-2">
            <Label htmlFor="photos">Photos</Label>
            <Input
              id="photos"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="cursor-pointer"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : isEditing ? "Modifier" : "Enregistrer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}