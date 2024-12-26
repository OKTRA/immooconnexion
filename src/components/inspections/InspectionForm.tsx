import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useQueryClient } from "@tanstack/react-query"
import { Contract } from "@/integrations/supabase/types/contracts"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface InspectionFormProps {
  contract: Contract
  onSuccess?: () => void
}

export function InspectionForm({ contract, onSuccess }: InspectionFormProps) {
  const [hasDamages, setHasDamages] = useState(false)
  const [description, setDescription] = useState("")
  const [repairCosts, setRepairCosts] = useState("")
  const [photos, setPhotos] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const { toast } = useToast()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (photos.length > 0) {
      const urls = photos.map(file => URL.createObjectURL(file))
      setPreviewUrls(urls)
      return () => urls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [photos])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const depositAmount = contract.montant // Montant de la caution
      const returnedAmount = hasDamages ? 
        depositAmount - parseFloat(repairCosts) : 
        depositAmount

      // Upload photos if any
      const photoUrls: string[] = []
      if (photos.length > 0) {
        for (const photo of photos) {
          const fileExt = photo.name.split('.').pop()
          const fileName = `${crypto.randomUUID()}.${fileExt}`
          
          const { error: uploadError, data } = await supabase.storage
            .from('inspection_photos')
            .upload(fileName, photo)

          if (uploadError) throw uploadError
          if (data) photoUrls.push(data.path)
        }
      }

      const { error } = await supabase
        .from('property_inspections')
        .insert([{
          contract_id: contract.id,
          has_damages: hasDamages,
          damage_description: description,
          repair_costs: hasDamages ? parseFloat(repairCosts) : 0,
          deposit_returned: returnedAmount > 0 ? returnedAmount : 0,
          photo_urls: photoUrls,
          status: 'completé'
        }])

      if (error) throw error

      toast({
        title: "Inspection enregistrée",
        description: "L'inspection a été enregistrée avec succès",
      })

      queryClient.invalidateQueries({ queryKey: ['inspections'] })
      onSuccess?.()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
      })
    }
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)] md:h-auto">
      <form onSubmit={handleSubmit} className="space-y-4 p-1">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-4">
              <p>Montant de la caution: {contract.montant?.toLocaleString()} FCFA</p>
              {hasDamages && repairCosts && (
                <>
                  <p className="mt-2">Coûts de réparation: {parseFloat(repairCosts).toLocaleString()} FCFA</p>
                  <p className="mt-2">Montant à retourner: {(contract.montant - parseFloat(repairCosts)).toLocaleString()} FCFA</p>
                  <p className="text-xs mt-2 text-yellow-600">
                    Note: Le montant retourné sera déduit des bénéfices réalisés sur le bien
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="damages"
            checked={hasDamages}
            onCheckedChange={(checked) => setHasDamages(checked as boolean)}
          />
          <Label htmlFor="damages" className="text-sm md:text-base">Dégâts constatés</Label>
        </div>

        {hasDamages && (
          <>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm md:text-base">Description des dégâts</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez les dégâts constatés..."
                required={hasDamages}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costs" className="text-sm md:text-base">Coûts de réparation (FCFA)</Label>
              <Input
                id="costs"
                type="number"
                value={repairCosts}
                onChange={(e) => setRepairCosts(e.target.value)}
                placeholder="Montant des réparations"
                required={hasDamages}
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="photos" className="text-sm md:text-base">Photos de l'inspection</Label>
          <Input
            id="photos"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setPhotos(e.target.files ? Array.from(e.target.files) : [])}
            className="cursor-pointer"
          />
          {previewUrls.length > 0 && (
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        <div className="pt-4 flex justify-end space-x-2">
          <Button type="submit" className="w-full md:w-auto">
            Enregistrer l'inspection
          </Button>
        </div>
      </form>
    </ScrollArea>
  )
}