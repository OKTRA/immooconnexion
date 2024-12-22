import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useQueryClient } from "@tanstack/react-query"

export function PropertyDialog({ property, onOpenChange, open }: PropertyDialogProps) {
  const [image, setImage] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    bien: "",
    type: "",
    chambres: "",
    ville: "",
    loyer: "",
    taux_commission: "",
    caution: "",
  })
  const { toast } = useToast()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (property) {
      setFormData({
        bien: property.bien || "",
        type: property.type || "",
        chambres: property.chambres?.toString() || "",
        ville: property.ville || "",
        loyer: property.loyer?.toString() || "",
        taux_commission: property.taux_commission?.toString() || "",
        caution: property.caution?.toString() || "",
      })
    }
  }, [property])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async () => {
    try {
      let photo_url = property?.photo_url

      if (image) {
        const fileExt = image.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { error: uploadError, data } = await supabase.storage
          .from('product_photos')
          .upload(fileName, image)

        if (uploadError) throw uploadError
        photo_url = data.path
      }

      const propertyData = {
        bien: formData.bien,
        type: formData.type,
        chambres: parseInt(formData.chambres),
        ville: formData.ville,
        loyer: parseFloat(formData.loyer),
        taux_commission: parseFloat(formData.taux_commission),
        caution: parseFloat(formData.caution),
        photo_url,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        updated_at: new Date().toISOString(),
      }

      if (property?.id) {
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', property.id)

        if (error) throw error
        toast({
          title: "Bien modifié avec succès",
          description: "Le bien immobilier a été mis à jour",
        })
      } else {
        const { error } = await supabase
          .from('properties')
          .insert([{ ...propertyData, created_at: new Date().toISOString() }])

        if (error) throw error
        toast({
          title: "Bien ajouté avec succès",
          description: "Le bien immobilier a été ajouté à la liste",
        })
      }

      queryClient.invalidateQueries({ queryKey: ['properties'] })
      if (onOpenChange) onOpenChange(false)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'opération",
        variant: "destructive",
      })
    }
  }

  const dialogContent = (
    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{property ? "Modifier le bien" : "Ajouter un nouveau bien"}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="bien">Nom du bien</Label>
          <Input 
            id="bien" 
            placeholder="Ex: Appartement Jaune Block 1" 
            value={formData.bien}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="type">Type de bien</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="appartement">Appartement</SelectItem>
              <SelectItem value="maison">Maison</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="chambres">Nombre de chambres</Label>
          <Input 
            id="chambres" 
            type="number" 
            min="1" 
            value={formData.chambres}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ville">Ville</Label>
          <Input 
            id="ville" 
            value={formData.ville}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="loyer">Loyer mensuel (FCFA)</Label>
          <Input 
            id="loyer" 
            type="number" 
            value={formData.loyer}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="taux_commission">Taux de commission (%)</Label>
          <Input 
            id="taux_commission" 
            type="number" 
            min="5" 
            max="15" 
            placeholder="Entre 5 et 15%"
            value={formData.taux_commission}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="caution">Caution (FCFA)</Label>
          <Input 
            id="caution" 
            type="number"
            value={formData.caution}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="photo">Photo du bien</Label>
          <Input 
            id="photo" 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange}
          />
          {(image || property?.photo_url) && (
            <div className="mt-2">
              <img
                src={image ? URL.createObjectURL(image) : `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product_photos/${property.photo_url}`}
                alt="Aperçu"
                className="max-w-full h-auto rounded-md"
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => onOpenChange?.(false)}>Annuler</Button>
        <Button onClick={handleSubmit}>{property ? "Modifier" : "Enregistrer"}</Button>
      </div>
    </DialogContent>
  )

  if (onOpenChange) {
    return <Dialog open={open} onOpenChange={onOpenChange}>{dialogContent}</Dialog>
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Ajouter un bien</Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  )
}
