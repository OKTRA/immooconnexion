import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface PhotoUploadProps {
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  previewUrls: string[]
}

export function PhotoUpload({ onPhotoChange, previewUrls }: PhotoUploadProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="photos">Photos</Label>
      <Input
        id="photos"
        type="file"
        accept="image/*"
        multiple
        onChange={onPhotoChange}
        className="cursor-pointer"
      />
      {previewUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {previewUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Preview ${index + 1}`}
              className="w-full h-32 object-cover rounded-md"
            />
          ))}
        </div>
      )}
    </div>
  )
}