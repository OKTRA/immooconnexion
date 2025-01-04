import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface AmenitiesSectionProps {
  formData: any;
  setFormData: (data: any) => void;
  amenitiesList: string[];
}

export function AmenitiesSection({ formData, setFormData, amenitiesList }: AmenitiesSectionProps) {
  const handleAmenityChange = (amenity: string) => {
    const newAmenities = formData.amenities.includes(amenity)
      ? formData.amenities.filter((a: string) => a !== amenity)
      : [...formData.amenities, amenity]
    setFormData({ ...formData, amenities: newAmenities })
  }

  return (
    <div className="space-y-4">
      <Label>Équipements</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {amenitiesList.map((amenity) => (
          <div key={amenity} className="flex items-center space-x-2">
            <Checkbox
              id={amenity}
              checked={formData.amenities.includes(amenity)}
              onCheckedChange={() => handleAmenityChange(amenity)}
            />
            <Label htmlFor={amenity} className="text-sm font-normal">
              {amenity}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}