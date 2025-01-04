import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PhotoUploadSectionProps {
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  previewUrls: string[]
}

export function PhotoUploadSection({ handleImageChange, previewUrls }: PhotoUploadSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Photos</h3>
      <div className="grid gap-2">
        <Label htmlFor="photo">Photos de l'immeuble</Label>
        <Input 
          id="photo" 
          type="file" 
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="cursor-pointer"
        />
        {previewUrls.length > 0 && (
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Aperçu ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  )
}