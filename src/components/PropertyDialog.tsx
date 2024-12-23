import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PropertyFormFields } from "./property/PropertyFormFields"
import { usePropertyForm } from "./property/usePropertyForm"
import { PropertyDialogProps } from "./property/types"

export function PropertyDialog({ property, onOpenChange, open }: PropertyDialogProps) {
  const {
    image,
    setImage,
    formData,
    setFormData,
    handleSubmit
  } = usePropertyForm(property, onOpenChange)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const imagePreviewUrl = image 
    ? URL.createObjectURL(image) 
    : property?.photo_url 
      ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product_photos/${property.photo_url}`
      : undefined

  const dialogContent = (
    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{property ? "Modifier le bien" : "Ajouter un nouveau bien"}</DialogTitle>
      </DialogHeader>
      
      <PropertyFormFields
        formData={formData}
        setFormData={setFormData}
        handleImageChange={handleImageChange}
        imagePreviewUrl={imagePreviewUrl}
      />

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