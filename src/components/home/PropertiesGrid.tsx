import { Property } from "@/components/property/types"

interface PropertiesGridProps {
  properties: Array<Property & {
    agency_name: string;
    agency_address: string;
    status: string;
  }>;
}

export function PropertiesGrid({ properties }: PropertiesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {properties.map(property => (
        <div key={property.id} className="border rounded-lg p-4 bg-white shadow">
          <h2 className="text-lg font-semibold">{property.bien}</h2>
          <p>Type: {property.type}</p>
          <p>Chambres: {property.chambres}</p>
          <p>Ville: {property.ville}</p>
          <p>Loyer: {property.loyer} FCFA</p>
          <p>Statut: {property.status}</p>
          <p>Agence: {property.agency_name}</p>
          <p>Adresse de l'agence: {property.agency_address}</p>
        </div>
      ))}
    </div>
  )
}
