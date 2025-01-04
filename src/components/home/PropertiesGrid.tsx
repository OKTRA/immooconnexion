import { Property } from "@/components/property/types"
import { PropertyCard } from "./PropertyCard"

interface PropertiesGridProps {
  properties: Array<Property & {
    agency: {
      name: string;
      address: string;
    } | null;
  }>;
}

export function PropertiesGrid({ properties }: PropertiesGridProps) {
  if (!properties.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          Aucune propriété disponible pour le moment.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {properties.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}