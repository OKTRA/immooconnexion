import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Home, Building } from "lucide-react"
import { ApartmentDialog } from "@/components/property/ApartmentDialog"
import { ResponsiveTable } from "@/components/ui/responsive-table"
import { PropertyTableHeader } from "@/components/property-table/PropertyTableHeader"
import { DeleteApartmentDialog } from "./DeleteApartmentDialog"
import { Apartment } from "@/components/property/types"
import { ApartmentActions } from "./ApartmentActions"
import { TableCell, TableRow } from "@/components/ui/table"

interface ApartmentContentProps {
  apartments: Apartment[]
}

export function ApartmentContent({ apartments }: ApartmentContentProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null)

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
            <PropertyTableHeader type="apartment" />
            <ResponsiveTable.Body>
              {apartments?.map((apartment) => (
                <TableRow key={apartment.id}>
                  <TableCell>
                    <img 
                      src={apartment.photo_url || '/placeholder.svg'} 
                      alt={apartment.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{apartment.name}</TableCell>
                  <TableCell>Appartement</TableCell>
                  <TableCell>{apartment.total_units}</TableCell>
                  <TableCell>{apartment.city}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>{apartment.status}</TableCell>
                  <TableCell className="text-right">
                    <ApartmentActions
                      apartmentId={apartment.id}
                      onEdit={() => {
                        setSelectedApartment(apartment)
                        setEditDialogOpen(true)
                      }}
                      onDelete={() => {
                        setSelectedApartment(apartment)
                        setDeleteDialogOpen(true)
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </ResponsiveTable.Body>
          </ResponsiveTable>
        </TabsContent>

        <TabsContent value="available" className="bg-white rounded-lg shadow-sm">
          <ResponsiveTable>
            <PropertyTableHeader type="apartment" />
            <ResponsiveTable.Body>
              {apartments?.filter(a => a.status === 'disponible').map((apartment) => (
                <TableRow key={apartment.id}>
                  <TableCell>
                    <img 
                      src={apartment.photo_url || '/placeholder.svg'} 
                      alt={apartment.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{apartment.name}</TableCell>
                  <TableCell>Appartement</TableCell>
                  <TableCell>{apartment.total_units}</TableCell>
                  <TableCell>{apartment.city}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>{apartment.status}</TableCell>
                  <TableCell className="text-right">
                    <ApartmentActions
                      apartmentId={apartment.id}
                      onEdit={() => {
                        setSelectedApartment(apartment)
                        setEditDialogOpen(true)
                      }}
                      onDelete={() => {
                        setSelectedApartment(apartment)
                        setDeleteDialogOpen(true)
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </ResponsiveTable.Body>
          </ResponsiveTable>
        </TabsContent>

        <TabsContent value="occupied" className="bg-white rounded-lg shadow-sm">
          <ResponsiveTable>
            <PropertyTableHeader type="apartment" />
            <ResponsiveTable.Body>
              {apartments?.filter(a => a.status === 'occupé').map((apartment) => (
                <TableRow key={apartment.id}>
                  <TableCell>
                    <img 
                      src={apartment.photo_url || '/placeholder.svg'} 
                      alt={apartment.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{apartment.name}</TableCell>
                  <TableCell>Appartement</TableCell>
                  <TableCell>{apartment.total_units}</TableCell>
                  <TableCell>{apartment.city}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>{apartment.status}</TableCell>
                  <TableCell className="text-right">
                    <ApartmentActions
                      apartmentId={apartment.id}
                      onEdit={() => {
                        setSelectedApartment(apartment)
                        setEditDialogOpen(true)
                      }}
                      onDelete={() => {
                        setSelectedApartment(apartment)
                        setDeleteDialogOpen(true)
                      }}
                    />
                  </TableCell>
                </TableRow>
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