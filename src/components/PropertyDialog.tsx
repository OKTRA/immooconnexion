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
import { useState } from "react"

export function PropertyDialog() {
  const [image, setImage] = useState<File | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Ajouter un bien</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau bien</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nom">Nom du bien</Label>
            <Input id="nom" placeholder="Ex: Appartement Jaune Block 1" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Type de bien</Label>
            <Select>
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
            <Input id="chambres" type="number" min="1" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ville">Ville</Label>
            <Input id="ville" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="loyer">Loyer mensuel (FCFA)</Label>
            <Input id="loyer" type="number" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="caution">Caution (FCFA)</Label>
            <Input id="caution" type="number" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="photo">Photo du bien</Label>
            <Input id="photo" type="file" accept="image/*" onChange={handleImageChange} />
            {image && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Aperçu"
                  className="max-w-full h-auto rounded-md"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline">Annuler</Button>
          <Button>Enregistrer</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}