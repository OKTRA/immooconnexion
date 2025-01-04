import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Home, Building } from "lucide-react"
import { ApartmentDialog } from "@/components/property/ApartmentDialog"
import { PropertyTableRow } from "@/components/property-table/PropertyTableRow"
import { ResponsiveTable } from "@/components/ui/responsive-table"
import { PropertyTableHeader } from "@/components/property-table/PropertyTableHeader"
import { DeleteApartmentDialog } from "./DeleteApartmentDialog"
import { Property } from "@/integrations/supabase/types/properties"
import { Apartment } from "@/components/property/types"

interface ApartmentContentProps {
  properties: Property[]
}

export function ApartmentContent({ properties }: ApartmentContentProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null)

  // Conversion de Property vers Apartment pour la compatibilité
  const convertPropertyToApartment = (property: Property): Apartment => {
    return {
      id: property.id,
      name: property.bien,
      total_units: property.total_units || 1,
      city: property.ville || "",
      country: "CI",
      owner_name: property.owner_name || null,
      owner_phone: property.owner_phone || null,
      photo_url: property.photo_url,
      status: property.statut,
      agency_id: property.agency_id,
      created_by_user_id: property.created_by_user_id || null,
      created_at: property.created_at,
      updated_at: property.updated_at
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Appartements</h1>
        <ApartmentDialog />
      </div>

      <Tabs defaultValue="all" className="w-full space-y-6">
        <TabsList className="bg-white p-1 rounded-lg shadow-sm">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Building2 className="h-4 w-4 mr-2" />
            Tous
          </TabsTrigger>
          <TabsTrigger value="available" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Home className="h-4 w-4 mr-2" />
            Disponibles
          </TabsTrigger>
          <TabsTrigger value="occupied" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Building className="h-4 w-4 mr-2" />
            Occupés
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="bg-white rounded-lg shadow-sm">
          <ResponsiveTable>
            <PropertyTableHeader />
            <ResponsiveTable.Body>
              {properties?.map((property) => (
                <PropertyTableRow
                  key={property.id}
                  property={property}
                  onEdit={() => {
                    setSelectedApartment(convertPropertyToApartment(property))
                    setEditDialogOpen(true)
                  }}
                  onDelete={() => {
                    setSelectedApartment(convertPropertyToApartment(property))
                    setDeleteDialogOpen(true)
                  }}
                />
              ))}
            </ResponsiveTable.Body>
          </ResponsiveTable>
        </TabsContent>

        <TabsContent value="available" className="bg-white rounded-lg shadow-sm">
          <ResponsiveTable>
            <PropertyTableHeader />
            <ResponsiveTable.Body>
              {properties?.filter(p => p.statut === 'disponible').map((property) => (
                <PropertyTableRow
                  key={property.id}
                  property={property}
                  onEdit={() => {
                    setSelectedApartment(convertPropertyToApartment(property))
                    setEditDialogOpen(true)
                  }}
                  onDelete={() => {
                    setSelectedApartment(convertPropertyToApartment(property))
                    setDeleteDialogOpen(true)
                  }}
                />
              ))}
            </ResponsiveTable.Body>
          </ResponsiveTable>
        </TabsContent>

        <TabsContent value="occupied" className="bg-white rounded-lg shadow-sm">
          <ResponsiveTable>
            <PropertyTableHeader />
            <ResponsiveTable.Body>
              {properties?.filter(p => p.statut === 'occupé').map((property) => (
                <PropertyTableRow
                  key={property.id}
                  property={property}
                  onEdit={() => {
                    setSelectedApartment(convertPropertyToApartment(property))
                    setEditDialogOpen(true)
                  }}
                  onDelete={() => {
                    setSelectedApartment(convertPropertyToApartment(property))
                    setDeleteDialogOpen(true)
                  }}
                />
              ))}
            </ResponsiveTable.Body>
          </ResponsiveTable>
        </TabsContent>
      </Tabs>

      <DeleteApartmentDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        selectedProperty={selectedApartment}
        onDelete={() => setSelectedApartment(null)}
      />

      <ApartmentDialog
        apartment={selectedApartment}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </div>
  )
}