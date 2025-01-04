import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Home, Building } from "lucide-react"
import { ApartmentDialog } from "@/components/property/ApartmentDialog"
import { PropertyTableRow } from "@/components/property-table/PropertyTableRow"
import { ResponsiveTable } from "@/components/ui/responsive-table"
import { PropertyTableHeader } from "@/components/property-table/PropertyTableHeader"
import { DeleteApartmentDialog } from "./DeleteApartmentDialog"

interface Property {
  id: string
  [key: string]: any
}

interface ApartmentContentProps {
  properties: Property[]
}

export function ApartmentContent({ properties }: ApartmentContentProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

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
                    setSelectedProperty(property)
                    setEditDialogOpen(true)
                  }}
                  onDelete={() => {
                    setSelectedProperty(property)
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
                    setSelectedProperty(property)
                    setEditDialogOpen(true)
                  }}
                  onDelete={() => {
                    setSelectedProperty(property)
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
                    setSelectedProperty(property)
                    setEditDialogOpen(true)
                  }}
                  onDelete={() => {
                    setSelectedProperty(property)
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
        selectedProperty={selectedProperty}
        onDelete={() => setSelectedProperty(null)}
      />

      <ApartmentDialog
        property={selectedProperty}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </div>
  )
}