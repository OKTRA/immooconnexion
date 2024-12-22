import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useQueryClient } from "@tanstack/react-query"
import { Contract } from "@/integrations/supabase/types/contracts"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Image } from "lucide-react"

interface InspectionFormProps {
  contract: Contract
  onSuccess?: () => void
}

export function InspectionForm({ contract, onSuccess }: InspectionFormProps) {
  const [hasDamages, setHasDamages] = useState(false)
  const [description, setDescription] = useState("")
  const [repairCosts, setRepairCosts] = useState("")
  const [photos, setPhotos] = useState<FileList | null>(null)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setPhotos(files)
      const urls = Array.from(files).map(file => URL.createObjectURL(file))
      setPreviewUrls(urls)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const depositAmount = contract.montant
      const returnedAmount = hasDamages ? 
        depositAmount - parseFloat(repairCosts) : 
        depositAmount

      const photoUrls: string[] = []
      if (photos) {
        for (let i = 0; i < photos.length; i++) {
          const photo = photos[i]
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
                  <p className="text-xs mt-2 text-yellow-600 dark:text-yellow-400">
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
                className="min-h-[100px] dark:bg-gray-800"
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
                className="dark:bg-gray-800"
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="photos" className="text-sm md:text-base">Photos de l'inspection</Label>
          <div className="relative">
            <Input
              id="photos"
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotosChange}
              className="cursor-pointer dark:bg-gray-800"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Image className="h-5 w-5 text-gray-500" />
            </div>
          </div>
          
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
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