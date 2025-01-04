import { ScrollArea } from "@/components/ui/scroll-area"
import { SaleFormFields } from "./SaleFormFields"
import { PhotoUpload } from "./PhotoUpload"

interface DialogContentProps {
  formData: any
  onChange: (field: string, value: string) => void
  onFilesSelected: (files: FileList | null) => void
  existingPhotos?: string[]
}

export function DialogContent({ 
  formData, 
  onChange, 
  onFilesSelected, 
  existingPhotos 
}: DialogContentProps) {
  return (
    <ScrollArea className="h-[60vh] pr-4">
      <div className="space-y-6">
        <SaleFormFields
          formData={formData}
          onChange={onChange}
        />
        <PhotoUpload
          onFilesSelected={onFilesSelected}
          existingPhotos={existingPhotos}
        />
      </div>
    </ScrollArea>
  )
}