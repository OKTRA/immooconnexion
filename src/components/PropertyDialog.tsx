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
    onOpenChange?.(false)
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files))
    }
  }

  const dialogContent = (
    <DialogContent className="w-[95vw] max-w-[500px] h-[90vh] md:h-auto p-4 md:p-6">
      <DialogHeader>
        <DialogTitle className="text-lg md:text-xl">
          {property ? "Modifier le bien" : "Ajouter un nouveau bien"}
        </DialogTitle>
      </DialogHeader>
      
      <ScrollArea 
        className="h-[calc(90vh-120px)] md:h-auto pr-4"
        type="always"
        scrollHideDelay={400}
      >
        <PropertyFormFields
          formData={formData}
          setFormData={setFormData}
          handleImageChange={handleImageChange}
          imagePreviewUrl={previewUrls}
        />

        <div className="flex justify-end gap-2 mt-6">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange?.(false)}
            className="w-full md:w-auto"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit}
            className="w-full md:w-auto"
          >
            {property ? "Modifier" : "Enregistrer"}
          </Button>
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
        <Button className="w-full md:w-auto">Ajouter un bien</Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  )
}