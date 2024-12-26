import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface PhotoUploadProps {
  onFilesSelected: (files: FileList | null) => void
  existingPhotos?: string[]
  onRemoveExisting?: (url: string) => void
}

export function PhotoUpload({ onFilesSelected, existingPhotos = [], onRemoveExisting }: PhotoUploadProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const urls = Array.from(files).map(file => URL.createObjectURL(file))
      setPreviewUrls(urls)
      onFilesSelected(files)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="photos">Photos</Label>
        <Input
          id="photos"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="cursor-pointer"
        />
      </div>

      {(previewUrls.length > 0 || existingPhotos.length > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {existingPhotos.map((url, index) => (
            <div key={`existing-${index}`} className="relative">
              <img
                src={url}
                alt={`Photo ${index + 1}`}
                className="w-full h-32 object-cover rounded-md"
              />
              {onRemoveExisting && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => onRemoveExisting(url)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          {previewUrls.map((url, index) => (
            <div key={`preview-${index}`} className="relative">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-md"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}