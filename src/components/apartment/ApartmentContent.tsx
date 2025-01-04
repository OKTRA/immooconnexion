import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Home, Building } from "lucide-react"
import { ApartmentDialog } from "@/components/property/ApartmentDialog"
import { PropertyTableRow } from "@/components/property-table/PropertyTableRow"
import { ResponsiveTable } from "@/components/ui/responsive-table"
import { PropertyTableHeader } from "@/components/property-table/PropertyTableHeader"
import { DeleteApartmentDialog } from "./DeleteApartmentDialog"
import { Apartment } from "@/components/property/types"

interface ApartmentContentProps {
  apartments: Apartment[]
}

export function ApartmentContent({ apartments }: ApartmentContentProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null)

  const convertApartmentToProperty = (apartment: Apartment) => ({
    id: apartment.id,
    bien: apartment.name,
    type: 'appartement',
    chambres: 0,
    ville: apartment.city || '',
    loyer: 0,
    frais_agence: 0,
    taux_commission: 0,
    caution: 0,
    photo_url: apartment.photo_url,
    statut: apartment.status,
    user_id: '',
    agency_id: apartment.agency_id || '',
    created_at: apartment.created_at,
    updated_at: apartment.updated_at,
    owner_name: apartment.owner_name || '',
    owner_phone: apartment.owner_phone || '',
    total_units: apartment.total_units,
    property_category: 'apartment'
  })

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
              {apartments?.map((apartment) => (
                <PropertyTableRow
                  key={apartment.id}
                  property={convertApartmentToProperty(apartment)}
                  onEdit={() => {
                    setSelectedApartment(apartment)
                    setEditDialogOpen(true)
                  }}
                  onDelete={() => {
                    setSelectedApartment(apartment)
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
              {apartments?.filter(a => a.status === 'disponible').map((apartment) => (
                <PropertyTableRow
                  key={apartment.id}
                  property={convertApartmentToProperty(apartment)}
                  onEdit={() => {
                    setSelectedApartment(apartment)
                    setEditDialogOpen(true)
                  }}
                  onDelete={() => {
                    setSelectedApartment(apartment)
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
              {apartments?.filter(a => a.status === 'occupé').map((apartment) => (
                <PropertyTableRow
                  key={apartment.id}
                  property={convertApartmentToProperty(apartment)}
                  onEdit={() => {
                    setSelectedApartment(apartment)
                    setEditDialogOpen(true)
                  }}
                  onDelete={() => {
                    setSelectedApartment(apartment)
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