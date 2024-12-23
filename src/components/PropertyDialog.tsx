import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PropertyForm } from "./property-dialog/PropertyForm"
import { usePropertyForm } from "./property-dialog/usePropertyForm"
import { PropertyDialogProps } from "./property-dialog/types"

export function PropertyDialog({ property, onOpenChange, open }: PropertyDialogProps) {
  const { 
    image, 
    formData, 
    handleImageChange, 
    handleInputChange, 
    handleSubmit 
  } = usePropertyForm(property, onOpenChange)

  const dialogContent = (
    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{property ? "Modifier le bien" : "Ajouter un nouveau bien"}</DialogTitle>
      </DialogHeader>
      
      <PropertyForm
        formData={formData}
        onInputChange={handleInputChange}
        onTypeChange={(value) => handleInputChange({ target: { id: 'type', value } } as any)}
        onImageChange={handleImageChange}
        image={image}
        property={property}
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