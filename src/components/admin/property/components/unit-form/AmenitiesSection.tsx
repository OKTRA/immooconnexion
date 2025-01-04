import { Label } from "@/components/ui/label"

interface AmenitiesSectionProps {
  formData: any;
  setFormData: (data: any) => void;
  amenitiesList: string[];
}

export function AmenitiesSection({ formData, setFormData, amenitiesList }: AmenitiesSectionProps) {
  return (
    <div className="space-y-2">
      <Label>Équipements</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {amenitiesList.map((amenity) => (
          <label key={amenity} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.amenities.includes(amenity)}
              onChange={(e) => {
                const newAmenities = e.target.checked
                  ? [...formData.amenities, amenity]
                  : formData.amenities.filter((a: string) => a !== amenity)
                setFormData({ ...formData, amenities: newAmenities })
              }}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span>{amenity}</span>
          </label>
        ))}
      </div>
    </div>
  )
}