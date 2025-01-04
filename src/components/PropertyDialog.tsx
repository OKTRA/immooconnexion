import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PropertyFormFields } from "./property/PropertyFormFields"
import { usePropertyForm } from "./property/usePropertyForm"
import { PropertyDialogProps } from "./property/types"

export function PropertyDialog({ property, onOpenChange, open }: PropertyDialogProps) {
  const {
    images,
    setImages,
    formData,
    setFormData,
    handleSubmit,
    previewUrls
  } = usePropertyForm(property, () => {
    // Fermer le dialogue après la soumission réussie
    onOpenChange?.(false)
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files))
    }
  }

  const dialogContent = (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>{property ? "Modifier le bien" : "Ajouter un nouveau bien"}</DialogTitle>
      </DialogHeader>
      
      <ScrollArea className="h-[calc(100vh-200px)] md:h-auto">
        <PropertyFormFields
          formData={formData}
          setFormData={setFormData}
          handleImageChange={handleImageChange}
          imagePreviewUrl={previewUrls}
        />

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>Annuler</Button>
          <Button onClick={handleSubmit}>{property ? "Modifier" : "Enregistrer"}</Button>
        </div>
      </ScrollArea>
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