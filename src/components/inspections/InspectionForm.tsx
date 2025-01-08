import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Contract } from "@/integrations/supabase/types/contracts"

interface InspectionFormProps {
  contract: Contract
  onSuccess: () => void
}

export function InspectionForm({ contract, onSuccess }: InspectionFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    hasDamages: false,
    damageDescription: "",
    repairCosts: "0",
    depositReturned: contract.montant.toString(),
    photos: null as FileList | null,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let photoUrls: string[] = []

      if (formData.photos) {
        for (let i = 0; i < formData.photos.length; i++) {
          const file = formData.photos[i]
          const fileExt = file.name.split('.').pop()
          const fileName = `${Math.random()}.${fileExt}`
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('inspection_photos')
            .upload(fileName, file)

          if (uploadError) throw uploadError
          if (uploadData) {
            const { data: { publicUrl } } = supabase.storage
              .from('inspection_photos')
              .getPublicUrl(uploadData.path)
            photoUrls.push(publicUrl)
          }
        }
      }

      const { error: inspectionError } = await supabase
        .from('property_inspections')
        .insert({
          contract_id: contract.id,
          has_damages: formData.hasDamages,
          damage_description: formData.damageDescription,
          repair_costs: parseInt(formData.repairCosts),
          deposit_returned: parseInt(formData.depositReturned),
          photo_urls: photoUrls,
          status: 'completed'
        })

      if (inspectionError) throw inspectionError

      const { error: contractError } = await supabase
        .from('contracts')
        .update({ statut: 'terminé' })
        .eq('id', contract.id)

      if (contractError) throw contractError

      toast({
        title: "Inspection terminée",
        description: "L'inspection a été enregistrée avec succès",
      })

      onSuccess()
    } catch (error: any) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, photos: e.target.files })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="hasDamages"
          checked={formData.hasDamages}
          onCheckedChange={(checked) => setFormData({ ...formData, hasDamages: checked })}
        />
        <Label htmlFor="hasDamages">Dégâts constatés</Label>
      </div>

      {formData.hasDamages && (
        <>
          <div className="space-y-2">
            <Label htmlFor="damageDescription">Description des dégâts</Label>
            <Textarea
              id="damageDescription"
              value={formData.damageDescription}
              onChange={(e) => setFormData({ ...formData, damageDescription: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="repairCosts">Coût des réparations (FCFA)</Label>
            <Input
              id="repairCosts"
              type="number"
              value={formData.repairCosts}
              onChange={(e) => {
                const repairCosts = parseInt(e.target.value)
                const depositReturned = Math.max(0, contract.montant - repairCosts)
                setFormData({
                  ...formData,
                  repairCosts: e.target.value,
                  depositReturned: depositReturned.toString()
                })
              }}
              required
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="depositReturned">Montant de la caution à rembourser (FCFA)</Label>
        <Input
          id="depositReturned"
          type="number"
          value={formData.depositReturned}
          onChange={(e) => setFormData({ ...formData, depositReturned: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="photos">Photos</Label>
        <Input
          id="photos"
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotosChange}
          className="cursor-pointer"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Chargement..." : "Terminer l'inspection"}
        </Button>
      </div>
    </form>
  )
}