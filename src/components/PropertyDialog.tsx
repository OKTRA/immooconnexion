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

interface PropertyDialogProps {
  property?: any
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

export function PropertyDialog({ property, onOpenChange, open }: PropertyDialogProps) {
  const [image, setImage] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    nom: "",
    type: "",
    chambres: "",
    ville: "",
    loyer: "",
    fraisAgence: "",
    tauxCommission: "",
    caution: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    if (property) {
      setFormData({
        nom: property.bien || "",
        type: property.type || "",
        chambres: property.chambres?.toString() || "",
        ville: property.ville || "",
        loyer: property.loyer || "",
        fraisAgence: property.fraisAgence || "",
        tauxCommission: property.tauxCommission || "",
        caution: property.caution || "",
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
      let photoUrl = property?.photoUrl

      if (image) {
        const fileExt = image.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { error: uploadError, data } = await supabase.storage
          .from('product_photos')
          .upload(fileName, image)

        if (uploadError) throw uploadError
        photoUrl = data.path
      }

      const propertyData = {
        ...formData,
        photoUrl,
        updated_at: new Date(),
      }

      if (property?.id) {
        // Update existing property
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
        // Create new property
        const { error } = await supabase
          .from('properties')
          .insert([{ ...propertyData, created_at: new Date() }])

        if (error) throw error
        toast({
          title: "Bien ajouté avec succès",
          description: "Le bien immobilier a été ajouté à la liste",
        })
      }

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
          <Label htmlFor="nom">Nom du bien</Label>
          <Input 
            id="nom" 
            placeholder="Ex: Appartement Jaune Block 1" 
            value={formData.nom}
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
          <Label htmlFor="fraisAgence">Frais d'agence (FCFA)</Label>
          <Input 
            id="fraisAgence" 
            type="number" 
            placeholder="Montant négocié avec le locataire"
            value={formData.fraisAgence}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="tauxCommission">Taux de commission (%)</Label>
          <Input 
            id="tauxCommission" 
            type="number" 
            min="5" 
            max="15" 
            placeholder="Entre 5 et 15%"
            value={formData.tauxCommission}
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
          {(image || property?.photoUrl) && (
            <div className="mt-2">
              <img
                src={image ? URL.createObjectURL(image) : `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product_photos/${property.photoUrl}`}
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