import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PhotoUploadSectionProps {
  onPhotosChange: (files: FileList | null) => void;
}

export function PhotoUploadSection({ onPhotosChange }: PhotoUploadSectionProps) {
  return (
    <div className="space-y-4">
      <Label htmlFor="photos">Photos</Label>
      <Input
        id="photos"
        type="file"
        accept="image/*"
        onChange={(e) => onPhotosChange(e.target.files)}
        className="cursor-pointer"
      />
    </div>
  )
}